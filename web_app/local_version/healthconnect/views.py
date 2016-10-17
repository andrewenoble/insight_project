from flask import render_template
from flask import request
from healthconnect import app
from model import model

@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')    

@app.route('/output')
def output():
    user_text = request.args.get('user_text')
    comment_data_dict = model(user_text)
    return render_template('output.html', comment_data_dict=comment_data_dict) 

@app.route('/about')
def about():
	return render_template('about.html')  

@app.route('/contact')
def contact():
	return render_template('contact.html') 

