# created by Alagu Swrnam Karruppiah
from pycognito import Cognito
from google.cloud import firestore
from datetime import datetime
import boto3
import json
import requests

def hello_world(request):
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
        docCK = db.collection(u'cipher-key').document(reqJson['userId'])
        docCK = docCK.get().to_dict()
        docUT = db.collection(u'user-type').document(reqJson['userId'])
        docUT = docUT.get().to_dict()
        
        payloadReq = {
            'key': docCK['key'],
            'cipherText': reqJson['cipherText']
        }
        
        response = requests.post('https://se57ekosllxgjvjtv3b57u5qtu0vhxuv.lambda-url.us-east-1.on.aws/',json=payloadReq)
        text = response.text
        
        if docCK['text'] == text:
            docLS = db.collection(u'login-session').document(reqJson['userId'])
            docLS.set({
                u'loginState': 'online',
                u'loginTime': datetime.now(),
                u'logoutTime': ''
            })
            return ({
                'success': True,
                'message': 'Correct Answer',
                'type': docUT['type']
            }, 200, headers)
        else:
            return ({
                'success': False,
                'message': 'Incorrect Answer'
            }, 200, headers)

    except Exception as e:
        return ({
            'success': False,
            'error': str(e)
        }, 500, headers)
