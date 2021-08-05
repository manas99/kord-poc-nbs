import { Component, OnInit } from '@angular/core';

import { MainService } from '../../services/main.service'
import { NearService } from '../../services/near.service'
import { SodiumService } from '../../services/sodium.service'
import { IpfsService } from '../../services/ipfs.service'
import { LoaderService } from '../../services/loader.service'

declare let bootstrap: any;

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

	selected_file: any = null;
	selected_ext: string = "Extension";
	selected_filename: string = "";

	my_files: any = []
	my_access_keys: any = {};
	my_access_files: any = [];
	my_account_name: string = "";
	my_public_key: string = "";

	share_account_name: string = "";
	share_public_key: string = "";
	share_file: any = {};

	accessors: any = [];

	constructor(private loader_: LoaderService, public near_: NearService, private main_: MainService, private sod_: SodiumService, private ipfs_: IpfsService) { }

	ngOnInit() {
		this.refreshFiles()
		this.my_account_name = this.near_.getAccountName();
		this.my_public_key = this.near_.uint8arrayToBase58(this.near_.getCurve22519KeyPair().publicKey);
	}

	async refreshFiles() {
		this.my_access_files = [];
		this.my_files = await this.near_.getMyFiles();
		let files = await this.near_.getMyAccessKeys();
		for (let x in files) {
			this.my_access_keys[x] = files[x].file_access;
			this.my_access_files.push(files[x].file)
		}
	}

	fileChanged(e: any) {
		if (e.target.files.length > 0) {
			this.selected_file = e.target.files[0];
			var split_arr = this.selected_file.name.split(".");
			if (split_arr.length > 0) {
				this.selected_ext = split_arr[split_arr.length - 1]
			} else {
				this.selected_ext = ""
			}
		} else {
			this.selected_file = null;
			this.selected_ext = "Extension";
		}
	}

	async uploadFile() {
		this.loader_.start()
		try {
			var filename = this.selected_filename;
			if (!!this.selected_ext) {
				filename = filename + "." + this.selected_ext
			}
			let myKeyPair = this.near_.getCurve22519KeyPair();
			await this.main_.putOnBlockChain(this.selected_file, filename, this.selected_file.type, myKeyPair.publicKey);
			await this.refreshFiles()
		} catch (error) {

		}
		this.loader_.stop()
	}

	async downloadFile(file: any) {
		this.loader_.start()
		try {
			let access_key = this.my_access_keys[file.cid];
			await this.main_.fetchDecryptAndDownload(file, access_key)
		} catch (error) {
			this.loader_.showError("An error occured.");
		}
		this.loader_.stop()
	}

	shareModalShow(file: any) {
		this.share_file = file;
	}

	async shareConfirm() {
		let myModal = new bootstrap.Modal(document.getElementById('shareModal'))
		myModal.hide();
		this.loader_.start()
		try {
			await this.main_.shareAccess(this.share_account_name, this.share_public_key, this.share_file, this.my_access_keys[this.share_file.cid]);
			this.loader_.stop()
			this.share_account_name = "";
			this.share_public_key = "";
			this.share_file = {};
		} catch (error) {
			this.loader_.showError("An error occured.");
		}
		this.loader_.stop()
	}

	async accessorsModalShow(file: any) {
		this.loader_.start()
		try {
			this.accessors = await this.main_.getAccessorsList(file.cid);
			let myModal = new bootstrap.Modal(document.getElementById('accessorsModal'))
			myModal.show();
		} catch (error) {

		}
		this.loader_.stop()
	}

}
