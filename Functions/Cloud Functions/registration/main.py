# created by Alagu Swrnam Karruppiah
from pycognito import Cognito
from google.cloud import firestore
import boto3
import json
import requests

def hello_world(request):
    cipherText = ''
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }

        return ('', 204, headers)
    headers = {
        'Access-Control-Allow-Origin': '*'
    }
    db = firestore.Client()
    try:
        reqJson = request.get_json()
        u = Cognito('us-east-2_MGKsBAFOX', '3eiqb6bpeonopir5a01eqtjn8m')
        # u.set_base_attributes(email=reqJson['email'])
        u.register(reqJson['userId'], reqJson['password'])
        docSQ = db.collection(u'security-question').document(reqJson['userId'])
        docSQ.set({
            u'question': reqJson['question'],
            u'answer': reqJson['answer']
        })
        docLS = db.collection(u'login-session').document(reqJson['userId'])
        docLS.set({
            u'loginState': 'offline',
            u'loginTime': '',
            u'logoutTime': ''
        })
        docUT = db.collection(u'user-type').document(reqJson['userId'])
        docUT.set({
            u'type': reqJson['type']
        })
        
        payloadReq = {
            'key': reqJson['key'],
            'text': reqJson['text']
        }
        response = requests.post('https://3kzh7g6sks5st7rkpp3fd752ji0rssnh.lambda-url.us-east-1.on.aws/',json=payloadReq)
        cipherText = response.text
        payloadReq2 = {
            "userId": reqJson["userId"],
            "name": reqJson["name"],
            "email": reqJson["email"],
            "mobile": reqJson["mobile"],
            "type": reqJson["type"]
        }
        response = requests.post('https://lzzta5e4f7r7ooxdduef4xep3q0kwgud.lambda-url.us-east-1.on.aws/', json = payloadReq2)
        
        docCK = db.collection(u'cipher-key').document(reqJson['userId'])
        docCK.set({
            u'key': reqJson['key'],
            u'text': reqJson['text']
        })
    except Exception as e:
        return ({
            'success': False,
            'error': str(e)
        }, 500, headers)

    return ({
        'success': True,
        'cipherText': cipherText,
        'message': 'User Created successfully'
    }, 200, headers)
