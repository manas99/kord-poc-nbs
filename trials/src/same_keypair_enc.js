const nearApi = require('near-api-js');
const _sodium = require('libsodium-wrappers');
const path = require('path');

var {
	keyStores
} = nearApi;

const homedir = require("os").homedir();
const CREDENTIALS_DIR = ".near-credentials";
const credentialsPath = path.join(homedir, CREDENTIALS_DIR);
const keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);

async function main() {
	await _sodium.ready;
	const sodium = _sodium;
	var user1 = await keyStore.getKey('testnet', 'manas.testnet');
	user2 = await keyStore.getKey('testnet', '80ec1b39334448cca09b33ddadaaf2e6ce6150b6bac26fe9b9f20738051ccb6d');

	const curve25519_pub1 = sodium.crypto_sign_ed25519_pk_to_curve25519(user1.publicKey.data);
	const curve25519_priv1 = sodium.crypto_sign_ed25519_sk_to_curve25519(nearApi.utils.serialize.base_decode(user1.secretKey));
	const curve25519_pub2 = sodium.crypto_sign_ed25519_pk_to_curve25519(user2.publicKey.data);
	const curve25519_priv2 = sodium.crypto_sign_ed25519_sk_to_curve25519(nearApi.utils.serialize.base_decode(user2.secretKey));


	const msg = sodium.crypto_secretstream_xchacha20poly1305_keygen();
	console.log(msg);
	//encryption start
	let encnonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
	let encmsg = sodium.crypto_box_easy(msg, encnonce, curve25519_pub2, curve25519_priv1)
	let encfinalmsg = new Uint8Array([...encnonce, ...encmsg])

	//decryption
	let nonce = encfinalmsg.slice(0, sodium.crypto_secretbox_NONCEBYTES)
	let cipher = encfinalmsg.slice(sodium.crypto_secretbox_NONCEBYTES);
	let dec = sodium.crypto_box_open_easy(cipher, nonce, curve25519_pub1, curve25519_priv2)
	console.log(dec)
}

main();