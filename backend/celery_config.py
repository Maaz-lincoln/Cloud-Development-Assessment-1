from celery import Celery
from database import get_db
from models import JobStatus
from crud import update_job_status
from utils import summarize_text
import asyncio

app = Celery('tasks', broker='redis://localhost:6379/0')

@app.task
def process_ai_job(job_id: int):
    async def run():
        db = next(get_db())
        await update_job_status(db, job_id, JobStatus.PROCESSING)
        result = await db.execute(select(Job).where(Job.id == job_id))
        job = result.scalars().first()
        if not job:
            return
        summary = summarize_text(job.input_text)
        await update_job_status(db, job_id, JobStatus.COMPLETED, summary)
        await create_notification(db, job.user, f"Job {job_id} completed!", "success")
    asyncio.run(run())