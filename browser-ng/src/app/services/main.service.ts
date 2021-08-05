import { Injectable } from '@angular/core';

import { SodiumService } from './sodium.service'
import { IpfsService } from './ipfs.service'
import { NearService } from './near.service'
import { LoaderService } from './loader.service'

// declare let window: any;

@Injectable({
	providedIn: 'root'
})
export class MainService {

	constructor(private load_: LoaderService, private sod_: SodiumService, private ipfs_: IpfsService, private near_: NearService) { }

	async load() {
		this.load_.start()
		await this.sod_.loadModule();
		await this.ipfs_.loadModule();
		await this.near_.loadModule();
		this.load_.stop()
	}

	readFileContents(file: any, arrayBuff: boolean = false) {
		return new Promise((resolve, reject) => {
			var reader = new FileReader();
			reader.onload = function() {
				resolve(reader.result);
			}
			if (arrayBuff) {
				reader.readAsArrayBuffer(file);
			} else {
				reader.readAsText(file);
			}

		});
	}

	async putOnBlockChain(raw_data: any, filename: string, type: string, pub_key: any) {
		let data: any = null;
		if (!!raw_data) {
			data = await this.readFileContents(raw_data, true);
		}
		let uint = new Uint8Array(data)
		let [key, enc] = this.sod_.encryptFileData(uint);
		const cid = await this.ipfs_.uploadData(enc);
		let myKeyPair = this.near_.getCurve22519KeyPair();
		let enc_key = this.sod_.encryptKey(pub_key, myKeyPair.secretKey, key);
		await this.near_.createFileRecOnBlockchain(this.near_.uint8arrayToBase58(myKeyPair.publicKey), this.near_.uint8arrayToBase58(enc_key), cid.toString(), filename, type);
	}

	async fetchDecryptAndDownload(file: any, access_key: any) {
		const ipfile = await this.ipfs_.getData(file.cid);
		let myKeyPair = this.near_.getCurve22519KeyPair();
		let key = this.sod_.decryptKey(myKeyPair.secretKey, this.near_.base58ToUint8array(access_key.owner_pub_key), this.near_.base58ToUint8array(access_key.encrypted_file_key));
		let dec = this.sod_.decryptFileData(key, ipfile);
		this.createAndDownloadBlobFile(dec, file.name)
	}

	async shareAccess(user: string, publicKey: string, file: any, access_key: any) {
		let myKeyPair = this.near_.getCurve22519KeyPair();
		let key = this.sod_.decryptKey(myKeyPair.secretKey, this.near_.base58ToUint8array(access_key.owner_pub_key), this.near_.base58ToUint8array(access_key.encrypted_file_key));
		let enckey = this.sod_.encryptKey(this.near_.base58ToUint8array(publicKey), myKeyPair.secretKey, key);
		await this.near_.shareAccess(user, file.cid, this.near_.uint8arrayToBase58(myKeyPair.publicKey), this.near_.uint8arrayToBase58(enckey))
	}

	async getAccessorsList(cid: string) {
		return await this.near_.getAccessorsForFile(cid);
	}

	createAndDownloadBlobFile(body: any, fileName: string) {
		const blob = new Blob([body]);
		if (navigator.msSaveBlob) {
			navigator.msSaveBlob(blob, fileName);
		} else {
			const link = document.createElement('a');
			// Browsers that support HTML5 download attribute
			if (link.download !== undefined) {
				const url = URL.createObjectURL(blob);
				link.setAttribute('href', url);
				link.setAttribute('download', fileName);
				link.setAttribute('style', 'display: none');
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				URL.revokeObjectURL(url)
			}
		}
	}
}
