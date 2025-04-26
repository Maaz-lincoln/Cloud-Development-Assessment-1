To run the backend project, Python 3.13 and redis server required. for redis server u can download the binary file from this line https://github.com/microsoftarchive/redis/releases. After download run the redis server exe

Plz follow these steps

1: python3 -m venv venv
(This command will create virtual environment)

2: venv/Scripts/activate
(This command activate the environment)

3: pip install -r requirements.txt
(This will install all the packages which are mentioned in requirment.txt)
This will take some time all packages downloads and our model will also download

4:uvicorn main:app --reload
(This command will run the backend project on local host)

For next open new terminal

Activate the venv again usigng this command (venv/Scripts/activate) then move to step 5

(before running the bello two command active the venv and run redis server using binary file which i get from this link: https://github.com/microsoftarchive/redis/releases , extract and run redis-server.exe )

5:celery -A celery_config worker --loglevel=info --pool=solo

Again open new terminal and activate the venv

6: celery -A celery_config beat --loglevel=info
