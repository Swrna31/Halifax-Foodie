# created by Alagu Swrnam Karruppiah
import json
import boto3

def lambda_handler(event, context):
    # TODO implement
    event = json.loads(event['body'])

    dynamodb = boto3.resource('dynamodb')
    customerTable = dynamodb.Table('Customer')
    restaurantTable = dynamodb.Table('Restaurant')
    if  event['type'] == 'customer':
        customerTable.put_item(
            Item={
            	'cust_id': event['userId'],
            	'name': event['name'],
            	'email': event['email'],
            	'mobile': event['mobile'],
            	'loginStatus': {
            		'status': '',
            		'loginTime': '',
            		'logoutTime': ''
            	}
            }
        )
    else:
        restaurantTable.put_item(
            Item={
            	'rest_id': event['userId'],
            	'name': event['name'],
            	'email': event['email'],
            	'mobile': event['mobile'],
            	'loginStatus': {
            		'status': '',
            		'loginTime': '',
            		'logoutTime': ''
            	}
            }
        )
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
