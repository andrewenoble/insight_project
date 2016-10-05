# HealthConnect: Automating connections in online health forums

By [Andrew Noble](http://two.ucdavis.edu/~andrewnoble)

## About

This repo contains the Python, HTML, CSS, js, and D3.js to serve up my Insight Health Data Science web app, [HealthConnect](http://healthconnect.online), the result of a consulting opportunity with the Cambridge-based data science team at Merck.

## Requirements

* D3.js
* Python (Flask, NLTK, RE, Stop_words, Gensim, Numpy)

## Usage

Clone the repo.
```
git clone https://github.com/andrewenoble/insight_project.git
```

### Local version

Run the app on the local 5000 port in debugging mode.
```
cd local_version
python run.py
```
Open a web browser and navigate to ```127.0.0.1:5000```.

### AWS version

This can be deployed on a ```t2.micro``` free tier EC2 instance.  Once the instance is up and running, ssh to the home directory and setup the Python environment.
```
sudo apt-get update
sudo apt-get install python-pip python-dev build-essential
sudo pip install flask
sudo pip install numpy
sudo pip install nltk
sudo apt-get install python-scipy
sudo pip install gensim
```
Install a server and a monitoring tool.
```
sudo pip install gunicorn
sudo pip install supervisor
```
And create a file ```simple.conf``` containing
```
[program:myserver]
command=gunicorn views:app -w 4 -b 0.0.0.0:5000

[supervisord]
logfile=/home/ubuntu/supervisord.log
loglevel=debug
user=root
```
To start the server, type
```
sudo supervisord -c simple.conf
```
To make changes to the web app, kill the server
```
sudo pkill -f supervisor
```
edit files, and then re-start the server.  Additional work is needed to change the port from 5000 to 80, to setup an elastic IP address, and to associate the web app with a domain name.  Please let me know if you would like me to add those details.
