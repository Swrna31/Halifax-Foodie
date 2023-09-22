# created by Alagu Swrnam Karruppiah
# “Columnar Transposition Cipher - GeeksforGeeks,” GeeksforGeeks, May 2017. [Online]. Available: https://www.geeksforgeeks.org/columnar-transposition-cipher/#:~:text=The%20Columnar%20Transposition%20Cipher%20is,in%20columns%20one%20by%20one.. [Accessed: Dec. 05, 2022]
‌
import json
import math

# Decryption
def decryptMessage(key, cipher):
	msg = ""

	# track key indices
	k_indx = 0

	# track msg indices
	msg_indx = 0
	msg_len = float(len(cipher))
	msg_lst = list(cipher)

	# calculate column of the matrix
	col = len(key)
	
	# calculate maximum row of the matrix
	row = int(math.ceil(msg_len / col))

	# convert key into list and sort
	# alphabetically so we can access
	# each character by its alphabetical position.
	key_lst = sorted(list(key))

	# create an empty matrix to
	# store deciphered message
	dec_cipher = []
	for _ in range(row):
		dec_cipher += [[None] * col]

	# Arrange the matrix column wise according
	# to permutation order by adding into new matrix
	for _ in range(col):
		curr_idx = key.index(key_lst[k_indx])

		for j in range(row):
			dec_cipher[j][curr_idx] = msg_lst[msg_indx]
			msg_indx += 1
		k_indx += 1

	# convert decrypted msg matrix into a string
	try:
		msg = ''.join(sum(dec_cipher, []))
	except TypeError:
		raise TypeError("This program cannot",
						"handle repeating words.")

	null_count = msg.count('_')

	if null_count > 0:
		return msg[: -null_count]

	return msg


def lambda_handler(event, context):
    # TODO implement
    event = json.loads(event['body'])
    return {
        'statusCode': 200,
        'body': decryptMessage(event['key'],event['cipherText'])
    }
