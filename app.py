
# standart libs
import os
import sys
import shutil
import requests
import base64
import json

# flask
from flask import Flask
from flask import Response
from flask import request
from flask import redirect
from flask import url_for
from flask import render_template
from flask import send_from_directory
from werkzeug.utils import secure_filename

# ds libs
import pandas as pd
import numpy as np
import sklearn 
import catboost

#TOTAL_carottages = ['bk',	'GZ1',	'GZ2',	'GZ3',	'GZ4',	'GZ5',	'GZ7',	'DGK',	'NKTD',	'NKTM',	'NKTR',	'ALPS']

app = Flask(__name__)

# Main
@app.route('/', methods=['GET', 'POST'])
def main():
    
    df = pd.read_csv('data/test.csv')

    TOTAL_WELLS = df['well id'].unique()
    TOTAL_WELLS = TOTAL_WELLS[np.logical_not(np.isnan(TOTAL_WELLS))]
    TOTAL_WELLS.sort()
    TOTAL_WELLS = TOTAL_WELLS.astype(np.int32)

    TOTAL_CAROTTAGE = list(df.columns.drop(['well id', 'depth, m', 'lith', 'goal']))

    if request.method == 'POST':

        well = int(float(request.form.get('well', -1)))
        if well == -1:
            return render_template('main.html', wells=TOTAL_WELLS, carottages=TOTAL_CAROTTAGE, error_mess='Выберите скважину')
        carottages = request.form.getlist('carottages')

        # read full data csv
        df = pd.read_csv('data/test.csv')

        # choose well
        indexNames = df[df['well id'] != well ].index
        df.drop(indexNames , inplace=True)

        # sort
        df = df.sort_values(by=['depth, m'])
        df['well id'] = df['well id'].astype(int)

        # create chosen well csv
        csv_name = 'static/data/test{}.csv'.format(well)
        df.to_csv(csv_name)

        csv_name_to_js = '../' + csv_name

        chosen_carottages = json.dumps(carottages)

        return render_template('main.html', wells=TOTAL_WELLS, carottages=TOTAL_CAROTTAGE, 
                                            chosen_carottages=chosen_carottages, csv_name=csv_name_to_js)

    return render_template('main.html', wells=TOTAL_WELLS, carottages=TOTAL_CAROTTAGE)


# Icon
@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'favicon.ico', mimetype='image/vnd.microsoft.icon')



# -------------------------------------------------------------------------------
# HELP
# -------------------------------------------------------------------------------

@app.route('/run_hello')
def run_hello():
    headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36'}
    r = requests.post("https://manaleks.herokuapp.com/hello", headers=headers, data = {'models':'SUPERHELLO'})

    # save ready image
    print(r)
    print(type(r))
    print(type(r.text))
    print(r.text)
    print(type(r.content))

    return r.text

# hello
@app.route('/hello', methods=['POST'])
def hello():
    return 'hello'

# change_url
@app.route('/change_url/<new_url>', methods=['GET'])
def change_url(new_url):
    global url 
    url = 'https://' + str(new_url) + '/'

    print(url)
    redirect(url)
    return url


if __name__ == "__main__":
    app.run(debug=True, port=5000)

