from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.routing import APIRouter
from auth import create_access_token, create_refresh_token, get_current_user, oauth2_scheme
from database import engine, Base, get_db
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from schemas import UserCreate, UserRead, UserLogin, JobCreate, JobRead, NotificationRead, Token, CreditsAdd
from crud import create_user, authenticate_user, add_credits, create_job, update_job_status, get_jobs_for_user, create_notification, get_notifications_for_user, mark_notification_read
from utils import summarize_text, send_notification
from celery_config import process_ai_job as process_ai_job_task
import models
import logging
from jose import jwt, JWTError

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="AI Service Lab API",
    description="A demo AI-powered backend for text summarization with user authentication, job queuing, and notifications.",
    version="1.0.0"
)

router = APIRouter()

origins = ["*"] 
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database tables created successfully")

@app.post("/auth/signup", response_model=UserRead, description="Register a new user with username, email, and password.")
async def signup(user: UserCreate, db: AsyncSession = Depends(get_db)):
    u = await create_user(db, user.username, user.email, user.password)
    logger.info(f"User {u.username} signed up successfully")
    return u

@app.post("/auth/token", response_model=Token, description="Login to get access and refresh tokens.")
async def login(user: UserLogin, db: AsyncSession = Depends(get_db)):
    u = await authenticate_user(db, user.username, user.password)
    if not u:
        logger.warning(f"Failed login attempt for username: {user.username}")
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    access_token = create_access_token({"sub": u.username})
    refresh_token = create_refresh_token({"sub": u.username})
    logger.info(f"User {u.username} logged in successfully")
    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}

@app.post("/auth/refresh", response_model=Token, description="Refresh an access token using a refresh token.")
async def refresh_token(refresh_token: str, db: AsyncSession = Depends(get_db)):
    from auth import SECRET_KEY, ALGORITHM
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate refresh token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") != "refresh":
            raise credentials_exception
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    from auth import get_user_by_username
    user = await get_user_by_username(db, username)
    if user is None:
        raise credentials_exception
    access_token = create_access_token({"sub": user.username})
    logger.info(f"Access token refreshed for user {user.username}")
    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}

@router.get("/auth/me", response_model=UserRead)
async def get_me(current_user: models.User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return current_user

@app.post("/credits/add", response_model=UserRead, description="Add credits to the current user (for testing).")
async def add_user_credits(credits: CreditsAdd, db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)):
    user = await add_credits(db, current_user, credits.credits)
    logger.info(f"Added {credits.credits} credits to user {user.username}")
    return user

@app.get("/credits", description="Get the current user's credits.")
async def get_credits(current_user: models.User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return {"credits": current_user.credits}

@app.post("/jobs/submit", response_model=JobRead, description="Submit a text summarization job.")
async def submit_job(job: JobCreate, db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)):
    if current_user.credits < 10:
        raise HTTPException(status_code=400, detail="Credits are low. You will receive 100 credits next day.")
    
    result = await db.execute(select(models.Job).where(models.Job.user_id == current_user.id))
    user_jobs = result.scalars().all()
    user_job_count = len(user_jobs) + 1 

    submitted_job = await create_job(db, current_user, job.input_text)
    process_ai_job_task.delay(submitted_job.id)
    await create_notification(
        db,
        current_user,
        f"Your {user_job_count}{'st' if user_job_count == 1 else 'nd' if user_job_count == 2 else 'rd' if user_job_count == 3 else 'th'} job was submitted! Credits will be deducted upon completion.",
        "info"
    )
    logger.info(f"Job {submitted_job.id} submitted by user {current_user.username}")
    return submitted_job

@app.get("/jobs/my", response_model=list[JobRead], description="Get all jobs for the current user.")
async def my_jobs(db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)):
    jobs = await get_jobs_for_user(db, current_user)
    return jobs

@app.get("/notifications", response_model=list[NotificationRead], description="Get all notifications for the current user.")
async def get_my_notifications(db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)):
    return await get_notifications_for_user(db, current_user)

@app.post("/notifications/{notification_id}/read", response_model=NotificationRead, description="Mark a notification as read.")
async def mark_as_read(notification_id: int, db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)):
    notif = await mark_notification_read(db, notification_id, current_user)
    logger.info(f"Notification {notification_id} marked as read by user {current_user.username}")
    return notif

@app.get("/ping", description="Health check endpoint.")
def ping():
    return {"message": "pong"}

app.include_router(router)