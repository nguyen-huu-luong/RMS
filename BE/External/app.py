import joblib
from datetime import datetime
from os import environ as env
from dotenv import find_dotenv, load_dotenv
from flask import Flask, url_for, request, jsonify
from flask_cors import CORS
import pandas as pd
from csmodel import *
from datetime import *
import json

ENV_FILE = find_dotenv()
if ENV_FILE:
    load_dotenv(ENV_FILE)

app = Flask(__name__)
CORS(app)
model = joblib.load('./model/model.pkl')

def getAge(birthday): 
  birthday_year = int(birthday.split('-')[0])
  current_year = int(datetime.now().year)
  return abs(current_year - birthday_year)

def getAverageItem(profit, total_items):
  return profit/total_items

def getDaySinceLastPurchase(last_purchase):
    today = date.today()
    last_purchase_day = last_purchase.split('T')[0]
    last_purchase_day_obj = datetime.strptime(last_purchase_day, "%Y-%m-%d").date()
    days = today - last_purchase_day_obj
    return days.days
    
    

def preProcessData(data):
    customers_dataframe= pd.DataFrame(data)
    customers_dataframe["Age"] = customers_dataframe.apply(lambda x: getAge(x["birthday"]),axis=1)
    customers_dataframe["Average Purchase Price"] = customers_dataframe.apply(lambda x: getAverageItem(x["profit"], x["total_items"]),axis=1)
    customers_dataframe["Days Since Last Purchase"] = customers_dataframe.apply(lambda x: getDaySinceLastPurchase(x["lastPurchase"]),axis=1)
    customers_dataframe.rename(columns={'profit': 'Total Spend'}, inplace=True)
    
    return customers_dataframe

def posProcessData(data, groups):
    groups_result = pd.DataFrame() 
    groups_result['id'] = data.loc[:, 'id']
    groups_result["groupId"] = groups
    groups_result = groups_result.to_dict('records')
    
    return groups_result

@app.route('/api/segment', methods=["POST"])
def segmentCustomer():
    try:
        request_data = request.get_json()
        customers_dataframe = preProcessData(request_data)
        exacted_customers_dataframe = customers_dataframe[["Age", "Total Spend", "Average Purchase Price", "Days Since Last Purchase"]]
        groups = model.segmentCustomer(exacted_customers_dataframe)
        groups_result = posProcessData(customers_dataframe, groups)
        
        return jsonify(groups_result)
    except Exception as err:
        print(err)
        return "Error"



if __name__ == '__main__':
    app.run(host=env.get("HOST"), port=env.get("PORT"), debug=True)