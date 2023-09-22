# created by Alagu Swrnam Karruppiah
from google.cloud import firestore
from datetime import datetime
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
    
    db = firestore.Client()
    userId = request.args.get('userId')
    docLS = db.collection(u'login-session').document(userId)
    docLSDict = docLS.get().to_dict();
    docLS.set({
        u'loginState': 'offline',
        u'loginTime': docLSDict['loginTime'],
        u'logoutTime': datetime.now()
    })

    docLH = db.collection(u'login-history')
    docLH.add({
        u'userId': userId,
        u'loginState': 'offline',
        u'loginTime': docLSDict['loginTime'],
        u'logoutTime': datetime.now()
    })
    return ({
        'success': True,
        'message': 'Logout successfully'
    }, 200, headers)
    