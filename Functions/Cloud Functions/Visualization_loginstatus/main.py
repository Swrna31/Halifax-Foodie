# https://www.youtube.com/watch?v=IHUJ3g01xmI
# created by Tushar Arora 
from google.cloud import firestore
import math
import pandas as pd 
from google.cloud import storage 

def StoreDatatoCloudStoragefromFireStore():
    firestore_client=firestore.Client("halifaxfoodie-2dc26")
    doc_login_status=firestore_client.collection("login-history").get()
    doc_login_session=firestore_client.collection("login-session").get()
  
    list_doc=[]
    for doc in doc_login_status:
        dict_doc=doc.to_dict()
        list_doc.append(dict_doc)
    print(list_doc)

    for doc_session in doc_login_session:
        dict_doc_session=doc_session.to_dict()
        list_doc.append(dict_doc_session)

    print(list_doc)
    dataFrame=pd.DataFrame.from_dict(list_doc)
    print(dataFrame)
    cloud_storage=storage.Client()
    cloud_bucket=cloud_storage.get_bucket("group13_halifax_foodie")
    blob=cloud_bucket.blob("login_status.csv")
    blob.upload_from_string(dataFrame.to_csv(),"text/csv")
    if len(list_doc)>1 :
        return "refresh successfully"
    else:
        return "Data is alreadyUptodate"

def hello_world(request):
    """Responds to any HTTP request.
    Args:
        request (flask.Request): HTTP request object.
    Returns:
        The response text or any set of values that can be turned into a
        Response object using
        `make_response <http://flask.pocoo.org/docs/1.0/api/#flask.Flask.make_response>`.
    """
    header={"Access-control-Allow-origin":"*"}
    message=StoreDatatoCloudStoragefromFireStore()
    return (message,200,header)
    
    request_json = request.get_json()
    if request.args and 'message' in request.args:
     
        return request.args.get('message')
    elif request_json and 'message' in request_json:
        return request_json['message']
    else:
        return f'Hello World!'
