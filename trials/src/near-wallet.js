const nearApi = require('near-api-js');
const path = require('path');
const enc = require("./lib/encryption.js");
const _sodium = require('libsodium-wrappers');

var {
	keyStores
} = nearApi;

const homedir = require("os").homedir();
const CREDENTIALS_DIR = ".near-credentials";
const credentialsPath = path.join(homedir, CREDENTIALS_DIR);
const keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);


var user1;
var user2;
async function getUsers() {
	user1 = await keyStore.getKey('testnet', 'manas.testnet');
	user2 = await keyStore.getKey('testnet', '80ec1b39334448cca09b33ddadaaf2e6ce6150b6bac26fe9b9f20738051ccb6d');
}
async function main() {
	await _sodium.ready;
	const sodium = _sodium;

	await getUsers();
	// console.log(user1.publicKey.data);
	// console.log(user2.publicKey.data);
	// console.log(user1.secretKey);
	// console.log(user2.secretKey);

	const plaintext = {
		'text': "Hello!"
	};

	const priv1 = nearApi.utils.serialize.base_decode(user1.secretKey);
	const priv2 = nearApi.utils.serialize.base_decode(user2.secretKey);

	const curve25519_pub1 = sodium.crypto_sign_ed25519_pk_to_curve25519(user1.publicKey.data);
	const curve25519_pub2 = sodium.crypto_sign_ed25519_pk_to_curve25519(user2.publicKey.data);
	const curve25519_priv1 = sodium.crypto_sign_ed25519_sk_to_curve25519(priv1);
	const curve25519_priv2 = sodium.crypto_sign_ed25519_sk_to_curve25519(priv2);

	const sharedA = enc.box.before(curve25519_pub2, curve25519_priv1);
	const sharedB = enc.box.before(curve25519_pub1, curve25519_priv2);
	//
	var encrypted = enc.encrypt(sharedA, plaintext);
	console.log("Encrypted: ", encrypted);
	var decrypted = enc.decrypt(sharedB, encrypted);
	console.log("Decrypted: ", decrypted);

	// var box = nacl.box(plaintext, nonce, user2.publicKey.data, )
	// console.log(box)
}
main();