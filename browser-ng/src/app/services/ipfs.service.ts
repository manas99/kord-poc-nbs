import { Injectable } from '@angular/core';

import * as IPFS from 'ipfs-core'

@Injectable({
	providedIn: 'root'
})
export class IpfsService {

	_ipfs: any = null;

	constructor() {
	}

	async loadModule() {
		this._ipfs = await IPFS.create()
	}

	async uploadData(data: any) {
		const ret = await this._ipfs.add(data)
		return ret.cid;
	}

	async getData(cid: any) {
		let content = new Uint8Array();
		for await (const file of this._ipfs.get(cid)) {
			if (!file.content) continue;
			for await (const chunk of file.content) {
				content = new Uint8Array([...content, ...chunk]);
			}
		}
		return content;
	}
}
