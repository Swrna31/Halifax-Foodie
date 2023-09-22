# created by Alagu Swrnam Karruppiah
from pycognito import Cognito
import boto3
import json

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
    
    try:
        reqJson = request.get_json()
        u = Cognito('us-east-2_MGKsBAFOX', '3eiqb6bpeonopir5a01eqtjn8m', username=reqJson['userId'])
        u.authenticate(password=reqJson['password'])
        return ({
            'success': True,
            'message': 'User verified successfully',
            'cognitoId': u.get_user().sub
        }, 200, headers)
    except Exception as e:
        return ({
            'success': False,
            'error': str(e)
        }, 500, headers)
