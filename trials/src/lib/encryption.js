var {
	box,
	randomBytes
} = require('tweetnacl');
var {
	decodeUTF8,
	encodeUTF8,
	encodeBase64,
	decodeBase64
} = require('tweetnacl-util');

const newNonce = () => randomBytes(box.nonceLength);
const generateKeyPair = () => box.keyPair();

const encrypt = (secretOrSharedKey, json, key = null) => {
	console.log("Encryption start: ")
	const nonce = newNonce();
	const messageUint8 = decodeUTF8(JSON.stringify(json));
	const encrypted = key ? box(messageUint8, nonce, key, secretOrSharedKey) : box.after(messageUint8, nonce, secretOrSharedKey);

	const fullMessage = new Uint8Array(nonce.length + encrypted.length);
	fullMessage.set(nonce);
	fullMessage.set(encrypted, nonce.length);

	console.log(nonce.length, encrypted.length, fullMessage.length)

	const base64FullMessage = encodeBase64(fullMessage);
	return base64FullMessage;
};

const decrypt = (secretOrSharedKey, messageWithNonce, key = null) => {
	console.log("Decryption start: ")
	const messageWithNonceAsUint8Array = decodeBase64(messageWithNonce);
	const nonce = messageWithNonceAsUint8Array.slice(0, box.nonceLength);
	const message = messageWithNonceAsUint8Array.slice(
		box.nonceLength,
		messageWithNonce.length
	);

	console.log(nonce.length, message.length, messageWithNonceAsUint8Array.length)

	const decrypted = key ? box.open(message, nonce, key, secretOrSharedKey) : box.open.after(message, nonce, secretOrSharedKey);

	if (!decrypted) {
		throw new Error('Could not decrypt message');
	}

	const base64DecryptedMessage = encodeUTF8(decrypted);
	return JSON.parse(base64DecryptedMessage);
};

// const obj = {
// 	hello: 'world'
// };
// const pairA = generateKeyPair();
// const pairB = generateKeyPair();
// const sharedA = box.before(pairB.publicKey, pairA.secretKey);
// const sharedB = box.before(pairA.publicKey, pairB.secretKey);
// const encrypted = encrypt(sharedA, obj);
// const decrypted = decrypt(sharedB, encrypted);
// console.log(obj, encrypted, decrypted);


exports.newNonce = newNonce;
exports.encrypt = encrypt;
exports.decrypt = decrypt;
exports.generateKeyPair = generateKeyPair;
exports.box = box;