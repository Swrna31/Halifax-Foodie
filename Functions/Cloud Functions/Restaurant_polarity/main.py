# https://www.youtube.com/watch?v=IHUJ3g01xmI
# created by Tushar Arora 
from google.cloud import firestore
import math
import pandas as pd 
from google.cloud import storage 

def polarity_restaurant():
    firestore_client=firestore.Client("halifaxfoodie-2dc26")
    doc_polarity_restaurant=firestore_client.collection("restaurant_polarity").get()
  
    list_doc_restaurant_polarity=[]
    for doc in doc_polarity_restaurant:
        dict_doc_polarity=doc.to_dict()
        list_doc_restaurant_polarity.append(dict_doc_polarity)
    print(list_doc_restaurant_polarity)

    
    list_of_restaurant_polarity_rows=[]
    for dict1 in list_doc_restaurant_polarity:
        restaurant_id=dict1["restaurantid"]
        list_polarity=dict1["polarity"]
        for sentiments in list_polarity:
            
            sentiment_name=sentiments["Sentiment"]
            mixed=sentiments["SentimentScore"]["Mixed"]
            negative=sentiments["SentimentScore"]["Negative"]
            neutral=sentiments["SentimentScore"]["Neutral"]
            positve=sentiments["SentimentScore"]["Positive"]
            list_of_restaurant_polarity_rows.append([restaurant_id,sentiment_name,mixed,negative,neutral,positve])
            
    print(list_of_restaurant_polarity_rows)
    dataFrame=pd.DataFrame(list_of_restaurant_polarity_rows, columns = ['Restaurant Id', 'Sentiment','Mixed','Negative','Neutral','Positive'])
    print(dataFrame)
    cloud_storage=storage.Client()
    cloud_bucket=cloud_storage.get_bucket("group13_halifax_foodie")
    blob=cloud_bucket.blob("restaurant_polarity.csv")
    blob.upload_from_string(dataFrame.to_csv(),"text/csv")
    if len(list_of_restaurant_polarity_rows)>=1:
        return "Successfully refresh"
    else:
        return "Data is already updated"

def hello_world(request):
    header={"Access-control-Allow-origin":"*"}
    message=polarity_restaurant()
    return (message,200,header)
    
    # request_json = request.get_json()
    # if request.args and 'message' in request.args:
    #     return request.args.get('message')
    # elif request_json and 'message' in request_json:
    #     return request_json['message']
    # else:
    #     return f'Hello World!'
