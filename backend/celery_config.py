from celery import Celery
from database import get_db
from models import Job, JobStatus, User
from crud import update_job_status, create_notification, deduct_credits
from utils import summarize_text
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import asyncio

import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Celery('tasks', broker='redis://localhost:6379/0', backend='redis://localhost:6379/0')

@app.task
def process_ai_job(job_id: int):
    loop = asyncio.new_event_loop()
    try:
        asyncio.set_event_loop(loop)
        return loop.run_until_complete(process_job(job_id))
    finally:
        loop.close()

@app.task
async def reset_user_credits():
    db_gen = get_db()
    try:
        async for db in db_gen:
            try:
                logger.info("Resetting user credits to 100")
                result = await db.execute(select(User))
                users = result.scalars().all()
                
                for user in users:
                    if user.credits != 100:
                        user.credits = 100
                        await create_notification(
                            db,
                            user,
                            "Your credits have been reset to 100!",
                            "info"
                        )
                        logger.info(f"Reset credits for user {user.username} to 100")
                
                await db.commit()
                logger.info("User credits reset completed")
                return {"status": "success", "message": "User credits reset to 100"}
            except Exception as e:
                logger.error(f"Error resetting user credits: {str(e)}")
                return {"status": "error", "message": str(e)}
            finally:
                await db.close()
    finally:
        await db_gen.aclose()

async def get_user_job_number(db: AsyncSession, user: User, current_job_id: int) -> int:
    """
    Calculate the user-specific job number by counting completed jobs up to the current job_id.
    """
    result = await db.execute(
        select(Job)
        .where(Job.user_id == user.id)
        .where(Job.id <= current_job_id)
        .order_by(Job.id)
    )
    user_jobs = result.scalars().all()
    return len(user_jobs)

async def process_job(job_id: int):
    db_gen = get_db()
    try:
        async for db in db_gen:
            try:
                logger.info(f"Processing job {job_id}")
                await update_job_status(db, job_id, JobStatus.PROCESSING)
                result = await db.execute(select(Job).where(Job.id == job_id))
                job = result.scalars().first()
                if not job:
                    logger.error(f"Job {job_id} not found")
                    return {"status": "error", "message": f"Job {job_id} not found"}

                user_result = await db.execute(select(User).where(User.id == job.user_id))
                user = user_result.scalars().first()
                if not user:
                    logger.error("User not found for job")
                    return {"status": "error", "message": "User not found for job"}

                try:
                    summary = summarize_text(job.input_text)
                    logger.info(f"Generated summary for job {job_id}: {summary}")
                    # Backup check for extractive summary
                    input_sentences = set([s.strip() for s in job.input_text.split('. ') if s.strip()])
                    summary_sentences = set([s.strip() for s in summary.split('. ') if s.strip()])
                    if any(s in input_sentences for s in summary_sentences):
                        raise ValueError(f"Summarization failed: output contains exact input sentences: {summary_sentences}")
                    await update_job_status(db, job_id, JobStatus.COMPLETED, summary)
                    user_job_number = await get_user_job_number(db, user, job_id)
                    user = await deduct_credits(db, user, 10)
                    await create_notification(
                        db,
                        user,
                        f"Your {user_job_number}{'st' if user_job_number == 1 else 'nd' if user_job_number == 2 else 'rd' if user_job_number == 3 else 'th'} job completed! Credits remaining: {user.credits}",
                        "success"
                    )
                    return {"status": "success", "summary": summary}
                except Exception as e:
                    logger.error(f"Job {job_id} failed: {str(e)}")
                    await update_job_status(db, job_id, JobStatus.FAILED, str(e))
                    await create_notification(db, user, f"Job {job_id} failed: {str(e)}", "error")
                    return {"status": "error", "message": str(e)}
            finally:
                await db.close()
    finally:
        await db_gen.aclose()