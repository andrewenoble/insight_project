# HealthConnect: Automating connections in online health forums

By [Andrew Noble](http://andrewenoble.com)

## About

This repo contains the Python, HTML, CSS, js, and D3.js used during Insight Health Data Science fellowship to 1) perform my data processing and natural language processing, and then 2) serve up my web app, [HealthConnect](http://www.healthconnect.live), best viewed in Chrome or Safari.  This project grew out of a consulting opportunity with the Cambridge-based Data Science team at Merck.

## Requirements

* D3.js
* Python (Flask, NLTK, RE, Stop_words, Gensim, Numpy)
* Postgres

## Usage

Clone the repo.
```
git clone https://github.com/andrewenoble/insight_project.git
```

### Data processing and NLP

Decend into the ```data_processing_and_nlp``` folder to find 1) ```data_processing.ipynb```, the Jupyter notebooks used to explore and clean a sample of reddit posts and then store the resulting Pandas dataframe in a Postgres database, and 2) ```nlp.ipynb```, the notebook used to perform the NLP, namely topic modeling with Latent Dirichlet Allocation.

### Web app: Local version

Run the app on the local 5000 port in debugging mode.
```
cd web_app/local_version
python run.py
```
Open a web browser and navigate to ```127.0.0.1:5000```.

### Web app: AWS version

This can be deployed on EC2 by launching the Amazon Linux AMI on an ```t2.micro``` instance associated to an Elastic IP address, after configuring the security group to allow inbound HTTP access on Port 80 from source ```0.0.0.0/0```.  Once the instance is up and running and configured, ssh to the home directory and setup the Python environment.
```
sudo yum update
sudo yum install python-pip python-dev build-essential
sudo pip install flask
sudo pip install numpy
sudo pip install nltk
sudo pip install stop_words
sudo yum install python-scipy
sudo pip install gensim 
sudo yum install git 
git clone https://github.com/andrewenoble/insight_project.git
```
Install a server and a monitoring tool.
```
sudo pip install gunicorn
sudo pip install supervisor
```
And start the server.
```
sudo /usr/local/bin/supervisord -c simple.conf
```
To make changes to the web app, kill the server
```
sudo /usr/bin/pkill -f supervisor
```
edit files, and then re-start the server.  
