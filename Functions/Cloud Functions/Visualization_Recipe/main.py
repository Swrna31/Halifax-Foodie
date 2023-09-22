# https://www.youtube.com/watch?v=IHUJ3g01xmI
# created by Tushar Arora 
from google.cloud import firestore
import math
import pandas as pd 
from google.cloud import storage 


def StoreDatatoCloudStoragefromFireStore():
    firestore_client=firestore.Client("halifaxfoodie-2dc26")
    doc_recipe=firestore_client.collection("Recipe").get()
  
    list_doc_recipe=[]
    for doc in doc_recipe:
        dict_doc_recipe=doc.to_dict()
        list_doc_recipe.append(dict_doc_recipe)
    print(list_doc_recipe)
    list_of_recipe_rows=[]
    for dict1 in list_doc_recipe:
        recipe_name=dict1["recipeName"]
        list_ingredtients=dict1["ingredients"]
        for ingredients in list_ingredtients:
            list_of_recipe_rows.append([recipe_name,ingredients])
            
    print(list_of_recipe_rows)
    dataFrame=pd.DataFrame(list_of_recipe_rows, columns = ['Recipe Name', 'Ingredients'])
    print(dataFrame)
    cloud_storage=storage.Client()
    cloud_bucket=cloud_storage.get_bucket("group13_halifax_foodie")
    blob=cloud_bucket.blob("recipe.csv")
    blob.upload_from_string(dataFrame.to_csv(),"text/csv")
    if len(list_of_recipe_rows)>=1:
        return "Successfully refresh"
    else:
        return "Data is already updated"

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
    message=StoreDatatoCloudStoragefromFireStore();
    return (message,200,header)
  
    # request_json = request.get_json()
    # if request.args and 'message' in request.args:
    #     return request.args.get('message')
    # elif request_json and 'message' in request_json:
    #     return request_json['message']
    # else:
    #     return f'Hello World!'
