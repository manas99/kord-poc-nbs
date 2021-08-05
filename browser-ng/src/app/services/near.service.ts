import { Injectable } from '@angular/core';

import * as nearApi from 'near-api-js'

import { environment } from '../../environments/environment';
import { SodiumService } from './sodium.service'

var {
	connect,
	keyStores,
	WalletConnection,
	utils,
	Contract
} = nearApi;

@Injectable({
	providedIn: 'root'
})
export class NearService {

	_near: any = null;
	_keyStore: any = null;
	_config: any = null;
	_wallet: any = null;
	_contract_name = environment.contract_address; //"dev-1627418879688-76294946434441";  // "example-contract.testnet";
	_keyPair: any = null;
	_account: any = null;
	_contract: any = null;

	constructor(private sod_: SodiumService) {
		this._keyStore = new keyStores.BrowserLocalStorageKeyStore();
		this._config = {
			keyStore: this._keyStore, // instance of BrowserLocalStorageKeyStore
			networkId: 'testnet',
			nodeUrl: 'https://rpc.testnet.near.org',
			walletUrl: 'https://wallet.testnet.near.org',
			helperUrl: 'https://helper.testnet.near.org',
			explorerUrl: 'https://explorer.testnet.near.org'
		};
	}

	async loadModule() {
		this._near = await connect(this._config);
		this._wallet = new WalletConnection(this._near, null);
		this._keyPair = await this._keyStore.getKey(this._config.networkId, this.getAccountName());
		// this._account = await this._near.account("example-account.testnet");
		this._contract = new Contract(
			this._wallet.account(), // the account object that is connecting
			this._contract_name,
			{
				viewMethods: ["getCreatedFiles", "getAccessKeys", "getAccessorsForFile"], // view methods do not change state but usually return a value
				changeMethods: ["createFile", "shareAccess"], // change methods modify state
			}
		);
	}

	signIn() {
		this._wallet.requestSignIn(this._contract_name)
	}

	signOut() {
		this._wallet.signOut();
	}

	isSignedIn() {
		if (!this._wallet) {
			return false;
		}
		return this._wallet.isSignedIn();
	}

	getAccountName() {
		return this._wallet.getAccountId();
	}

	getED25519KeyPair() {
		return this._keyPair;
	}

	getCurve22519KeyPair() {
		return this.sod_.convertToCurve22519(this._keyPair.publicKey.data, this.base_decode(this._keyPair.secretKey))
	}

	base_decode(val: any) {
		return utils.serialize.base_decode(val)
	}

	async createFileRecOnBlockchain(owner_pub_key: string, enc_key: string, cid: any, name: string, type: string) {
		const ret = await this._contract.createFile(
			{
				owner_pub_key: owner_pub_key,
				enc_key: enc_key,
				cid: cid,
				name: name,
				type: type
			},
		);
		console.log(ret);
		return ret;
	}

	async getMyFiles() {
		const files = await this._contract.getCreatedFiles({ owner: this._wallet.account().accountId });
		return files;
	}
	async getMyAccessKeys() {
		const files = await this._contract.getAccessKeys({ owner: this._wallet.account().accountId });
		return files;
	}
	async getAccessorsForFile(cid: string) {
		const files = await this._contract.getAccessorsForFile({ cid: cid });
		return files;
	}
	async shareAccess(user: string, cid: string, owner_pub_key: string, enc_key: string) {
		const files = await this._contract.shareAccess({ user: user, cid: cid, owner_pub_key: owner_pub_key, enc_key: enc_key });
	}

	uint8arrayToBase58(key: any) {
		return utils.serialize.base_encode(key)
	}
	base58ToUint8array(str: any) {
		return utils.serialize.base_decode(str)
	}

}
