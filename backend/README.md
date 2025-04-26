To run the project
1: python3 -m venv venv
(This will create virtual environment)

2: venv/Scripts/activate
(This command activate the environment)

3: pip install -r requirements.txt
(This will install all the packages which are mentioned in requirment.txt)

4:uvicorn main:app --reload

5:celery -A celery_config worker --loglevel=info --pool=solo
(before running the above command active the venv and run redis server using binary file which i get from this link: https://github.com/microsoftarchive/redis/releases , extract and run redis-server.exe )

celery -A celery_config worker --loglevel=info
celery -A celery_config beat --loglevel=info
