# created by Alagu Swrnam Karruppiah
# “Columnar Transposition Cipher - GeeksforGeeks,” GeeksforGeeks, May 2017. [Online]. Available: https://www.geeksforgeeks.org/columnar-transposition-cipher/#:~:text=The%20Columnar%20Transposition%20Cipher%20is,in%20columns%20one%20by%20one.. [Accessed: Dec. 05, 2022]
import json
import math

def encryptMessage(key, msg):
	cipher = ""

	# track key indices
	k_indx = 0

	msg_len = float(len(msg))
	msg_lst = list(msg)
	key_lst = sorted(list(key))

	# calculate column of the matrix
	col = len(key)
	
	# calculate maximum row of the matrix
	row = int(math.ceil(msg_len / col))

	# add the padding character '_' in empty
	# the empty cell of the matix
	fill_null = int((row * col) - msg_len)
	msg_lst.extend('_' * fill_null)

	# create Matrix and insert message and
	# padding characters row-wise
	matrix = [msg_lst[i: i + col]
			for i in range(0, len(msg_lst), col)]

	# read matrix column-wise using key
	for _ in range(col):
		curr_idx = key.index(key_lst[k_indx])
		cipher += ''.join([row[curr_idx]
						for row in matrix])
		k_indx += 1

	return cipher

def lambda_handler(event, context):
    # TODO implement
    event = json.loads(event['body'])
    return {
        'statusCode': 200,
        'body': encryptMessage(event['key'], event['text'])
    }
    