import { Injectable } from '@angular/core';

// @ts-ignore
import * as sodium from 'libsodium-wrappers'

@Injectable({
	providedIn: 'root'
})
export class SodiumService {

	_sodium: any = null;

	constructor() { }

	async loadModule() {
		await sodium.ready;
		this._sodium = sodium;
		// console.log(this._sodium)
	}

	convertToCurve22519(pk: any, sk: any) {
		return {
			publicKey: this._sodium.crypto_sign_ed25519_pk_to_curve25519(pk),
			secretKey: this._sodium.crypto_sign_ed25519_sk_to_curve25519(sk)
		}
	}

	encryptFileData(data: any) {
		const key = this._sodium.crypto_secretstream_xchacha20poly1305_keygen();
		let res = this._sodium.crypto_secretstream_xchacha20poly1305_init_push(key);
		let [state_out, header] = [res.state, res.header];
		let c1 = this._sodium.crypto_secretstream_xchacha20poly1305_push(state_out, data, null, this._sodium.crypto_secretstream_xchacha20poly1305_TAG_FINAL);
		return [key, new Uint8Array([...header, ...c1])];
	}

	decryptFileData(key: any, data: any) {
		let header = data.slice(0, this._sodium.crypto_secretstream_xchacha20poly1305_HEADERBYTES)
		let msg = data.slice(this._sodium.crypto_secretstream_xchacha20poly1305_HEADERBYTES, data.length)
		let state_in = this._sodium.crypto_secretstream_xchacha20poly1305_init_pull(header, key);
		let r1 = this._sodium.crypto_secretstream_xchacha20poly1305_pull(state_in, msg);
		return r1.message;
	}

	encryptKey(user2_pub: any, user1_priv: any, msg: any) {
		let encnonce = this._sodium.randombytes_buf(this._sodium.crypto_secretbox_NONCEBYTES);
		let encmsg = this._sodium.crypto_box_easy(msg, encnonce, user2_pub, user1_priv)
		return new Uint8Array([...encnonce, ...encmsg])
	}

	decryptKey(user2_priv: any, user1_pub: any, enc: any) {
		let nonce = enc.slice(0, this._sodium.crypto_secretbox_NONCEBYTES)
		let cipher = enc.slice(this._sodium.crypto_secretbox_NONCEBYTES);
		return this._sodium.crypto_box_open_easy(cipher, nonce, user1_pub, user2_priv)
	}

	stringToUint8Array(str: any) {
		return this._sodium.from_string(str)
	}

	toBase64(data: any) {
		return this._sodium.to_base64(data);
	}

}
