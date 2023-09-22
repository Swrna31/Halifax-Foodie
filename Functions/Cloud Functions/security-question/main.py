# created by Alagu Swrnam Karruppiah
from google.cloud import firestore

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
    docSQ = db.collection(u'security-question').document(userId)
    dicSQ = docSQ.get().to_dict()
    if request.method == 'GET':
        return (dicSQ, 200, headers)
    if dicSQ['answer'] == request.json['answer']:
        return ({
            'success': True,
            'message': 'Correct Answer'
        }, 200, headers)
    else:
        return ({
            'success': False,
            'message': 'Incorrect Answer'
        }, 200, headers)
