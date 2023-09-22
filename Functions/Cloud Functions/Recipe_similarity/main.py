# https://www.youtube.com/watch?v=yWVAmFaUtTY
# created by Tushar Arora 
from google.cloud import firestore
from google.cloud import bigquery
import math
import pandas as pd 

def collectionfromFireStore():
    firestore_client=firestore.Client("halifaxfoodie-2dc26")
    doc_recipe=firestore_client.collection("Recipe").get()
    print(doc_recipe)
    list_doc_recipe=[]
    for doc in doc_recipe:
        dict_doc_recipe=doc.to_dict()
        list_doc_recipe.append(dict_doc_recipe)
    list_of_recipe_rows=[]
    for dict1 in list_doc_recipe:
        recipe_name=dict1["recipeName"]
        list_ingredtients=dict1["ingredients"]
        for ingredients in list_ingredtients:
            list_of_recipe_rows.append([recipe_name,ingredients])
    return list_of_recipe_rows

def hello_world(request):
    request_json = request.get_json()
    recipe_name= request.args.get("recipeName")
    print(recipe_name)
    list_of_recipe_rows=collectionfromFireStore()
    dataFrame=pd.DataFrame(list_of_recipe_rows, columns = ['RecipeName', 'Ingredients'])
    dataFrame.to_gbq('group13_halifax_foodie.recipesimilarity', 
                        project_id='halifaxfoodie-2dc26', 
                        if_exists='append',
                        location='US')
    QUERY=('SELECT * FROM ML.PREDICT( MODEL`halifaxfoodie-2dc26.group13_halifax_foodie.recipe_similarity_Model_NEW`,'
    '(SELECT * FROM `halifaxfoodie-2dc26.group13_halifax_foodie.recipesimilarity` '
    'WHERE RecipeName="'+recipe_name+'"))')
    print(QUERY)
    client = bigquery.Client()
    query_job = client.query(QUERY)
    rows=query_job.result()
    list_similar_recipe=[]
    for row in rows:
        if row.predicted_RecipeName.lower()!=recipe_name.lower()  and  row.predicted_RecipeName not in list_similar_recipe:
            list_similar_recipe.append(row.predicted_RecipeName)
            if(len(list_similar_recipe)>2):
                break
    header={
    "Access-Control-Allow-Origin":"*"
    }

    similar_recipe=",".join(list_similar_recipe)
    return (similar_recipe,200,header)
    

   
    # if request.args and 'message' in request.args:
    #     return request.args.get('message')
    # elif request_json and 'message' in request_json:
    #     return request_json['message']
    # else:
    #     return f'Hello World!'
