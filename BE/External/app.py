import joblib
from os import environ as env
from dotenv import find_dotenv, load_dotenv
from flask import Flask, url_for, request, jsonify
from flask_cors import CORS
import pandas as pd
from csmodel import *
import json

ENV_FILE = find_dotenv()
if ENV_FILE:
    load_dotenv(ENV_FILE)

app = Flask(__name__)
CORS(app)
model = joblib.load('./model/model.pkl')

def process_data(data):
    age = []
    total_spend = []
    avg_price = []
    
    for item in data:
        age += [item.get("Age")]
        total_spend += [item.get("Total Spend")]
        avg_price += [item.get("Average Purchase Price")]
        
    temp = {"Age": age, "Total Spend": total_spend, "Average Purchase Price": avg_price}
    df = pd.DataFrame(temp)
    
    return df

@app.route('/api/segment', methods=["POST"])
def segment_customer():
    request_data = request.get_json()
    df = process_data(request_data)
    groups = model.segmentCustomer(df)
    
    return jsonify({"groups": groups.tolist()})

if __name__ == '__main__':
    app.run(host=env.get("HOST"), port=env.get("PORT"), debug=True)