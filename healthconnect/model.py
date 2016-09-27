#from sqlalchemy import create_engine
#import psycopg2
#import pandas as pd
#from scipy import spatial

import numpy as np
import re
import nltk

from nltk.tokenize import RegexpTokenizer
tokenizer = RegexpTokenizer(r'\w+')

from stop_words import get_stop_words
english_stop_words = get_stop_words('en')

from nltk.stem.porter import PorterStemmer
p_stemmer = PorterStemmer()

import gensim
from gensim import corpora, models


def clean(comment):

    comment = comment.lower()

    # Strip all HTML
    comment = re.sub(r'<[^<>]+>', ' ', comment)

    # Handle Numbers
    comment = re.sub(r'[0-9]+', '', comment)

    # Handle URLS
    comment = re.sub(r'(http|https)://[^\s]*', '', comment)

    # Handle Email Addresses
    comment = re.sub(r'[^\s]+@[^\s]+', '', comment)

    # Handle $ sign
    comment = re.sub(r'[$]+', '', comment)

    # Handle punctuation and special ascii characters
    comment = re.sub(r'[@$/\\#,-:&*+=\[\]?!(){}\'\">_<;%]+', '', comment) 

    # Handle strings containing the same vowel repeated 3 or more times.
    comment = re.sub(r'[@$/\\#,-:&*+=\[\]?!(){}\'\">_<;%]+', '', comment) 

    # Tokenize using NLTK.
    tokenized = tokenizer.tokenize(comment)

    # Remove English stop words using stop_words.
    stopped_tokenized = [token if len(token) > 2 else '' for token in tokenized 
                        if not token in english_stop_words]

    # Remove empty tokens.
    stopped_tokenized = [token for token in stopped_tokenized if not token in ['']]

    # Stem (Porter stemmer).
    stemmed_stopped_tokenized = [p_stemmer.stem(token) for token in stopped_tokenized]

    return stemmed_stopped_tokenized


def proj_into_topic_space(stemmed_stopped_tokenized):

    dictionary = corpora.Dictionary.load('/Users/andrewnoble/Documents/DS/merck/WebApp/healthconnect/static/gensim_model/reddit.dict')
    ldamodel = gensim.models.LdaModel.load('/Users/andrewnoble/Documents/DS/merck/WebApp/healthconnect/static/gensim_model/lda_v1_6.model')

    bow = dictionary.doc2bow(stemmed_stopped_tokenized)
    comment_topic_vector = ldamodel.get_document_topics(bow)

    # Calculate 3D topic space projections.
    comment_topic_proj = []
    for (topic, frac) in comment_topic_vector:
        comment_topic_proj.append(frac)

    # Calculate 2D simplex cooredinates.
    symplex_bottom_unit_vec = np.array([1, 0])
    symplex_lhs_unit_vec = np.array([np.cos(np.pi / 3), np.sin(np.pi / 3)])

    comment_symplex_coord_0 = comment_topic_proj[2] * symplex_bottom_unit_vec[0] \
        + comment_topic_proj[1] * symplex_lhs_unit_vec[0]
    comment_symplex_coord_1 = comment_topic_proj[2] * symplex_bottom_unit_vec[1] \
        + comment_topic_proj[1] * symplex_lhs_unit_vec[1]
        
    #comment_symplex_coord = [comment_symplex_coord_0, comment_symplex_coord_1]

    comment_data_dict = {}
    comment_data_dict['x'] = comment_symplex_coord_0
    comment_data_dict['y'] = comment_symplex_coord_1
    comment_data_dict['r'] = comment_topic_proj[0]
    comment_data_dict['e'] = comment_topic_proj[1]
    comment_data_dict['p'] = comment_topic_proj[2]

    return comment_data_dict
    # Save the projections and coordinates that will be loaded by D3 to generate the output.
    '''
    with open('/Users/andrewnoble/Documents/DS/merck/WebApp/healthconnect/static/data/user_input.csv', 'w') as file: 
        file.write('x,y,r,e,p') 
        file.write('\n')
        for coord in comment_symplex_coord:
            file.write('%.4f,' % coord)
        for i, proj in enumerate(comment_topic_proj):
            if i < 2:
                file.write('%.4f,' % proj)
            else:
                file.write('%.4f' % proj)
        file.write('\n')
    '''
    
#user = 'andrewnoble'                       
#host = 'localhost'
#dbname = 'insight'
#db = create_engine('postgres://%s%s/%s' % (user, host, dbname))
#con = psycopg2.connect(database=dbname, user=user)

def model(user_text='default'):

    '''
    if user_text == 'default':
        return 'please check your input and try again'
    else: 
        # map the user input onto a point in the 2D sentiment space
        user_text_blob = TextBlob(user_text)
        sentiment_space_pt = [user_text_blob.sentiment.polarity, user_text_blob.sentiment.subjectivity]

        # query the sentiment table to obtain all mappings of the reddit corpus
        query = "SELECT * from sentiments"
        sentiments = pd.read_sql_query(query, con).values[:, 1:] # drop the sentiments index column

        # find the index of the reddit comment that is closest in sentiment space 
        nearest_reddit_comment_id = spatial.KDTree(sentiments).query(sentiment_space_pt)[1]

        # query the reddit table to obtain the comment itself from the index
        query = "SELECT Body from reddit WHERE Id = %s" % nearest_reddit_comment_id
        nearest_reddit_comment = pd.read_sql_query(query, con).values[0][0]

        return nearest_reddit_comment
    '''

    stemmed_stopped_tokenized = clean(user_text)

    comment_data_dict = proj_into_topic_space(stemmed_stopped_tokenized)

    return comment_data_dict    
