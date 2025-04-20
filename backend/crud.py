from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models import User, Job, Notification, JobStatus
from auth import hash_password, verify_password  # Add verify_password import

async def create_user(db: AsyncSession, username: str, email: str, password: str):
    hashed_password = hash_password(password)
    user = User(username=username, email=email, hashed_password=hashed_password)
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user

async def authenticate_user(db: AsyncSession, username: str, password: str):
    result = await db.execute(select(User).where(User.username == username))
    user = result.scalars().first()
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user

async def add_credits(db: AsyncSession, user: User, credits: int):
    user.credits += credits
    await db.commit()
    await db.refresh(user)
    return user

async def create_job(db: AsyncSession, user: User, input_text: str):
    job = Job(user_id=user.id, input_text=input_text, status=JobStatus.PENDING)
    db.add(job)
    await db.commit()
    await db.refresh(job)
    return job

async def update_job_status(db: AsyncSession, job_id: int, status: JobStatus, output_text: str = None):
    result = await db.execute(select(Job).where(Job.id == job_id))
    job = result.scalars().first()
    if not job:
        return None
    job.status = status
    if output_text:
        job.output_text = output_text
    await db.commit()
    await db.refresh(job)
    return job

async def get_jobs_for_user(db: AsyncSession, user: User):
    result = await db.execute(select(Job).where(Job.user_id == user.id).order_by(Job.created_at.desc()))
    return result.scalars().all()

async def create_notification(db: AsyncSession, user: User, message: str, type: str):
    notification = Notification(user_id=user.id, message=message, type=type)
    db.add(notification)
    await db.commit()
    await db.refresh(notification)
    return notification

async def get_notifications_for_user(db: AsyncSession, user: User):
    result = await db.execute(select(Notification).where(Notification.user_id == user.id).order_by(Notification.created_at.desc()))
    return result.scalars().all()

async def mark_notification_read(db: AsyncSession, notification_id: int, user: User):
    result = await db.execute(select(Notification).where(Notification.id == notification_id, Notification.user_id == user.id))
    notification = result.scalars().first()
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    notification.is_read = True
    await db.commit()
    await db.refresh(notification)
    return notification