import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NearService } from '../../services/near.service'

@Component({
	selector: 'app-index',
	templateUrl: './index.component.html',
	styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

	constructor(private router: Router, private near_: NearService) { }

	ngOnInit(): void {
		if (!this.near_.isSignedIn()) {
			this.router.navigate(['/sign-in'])
		} else {
			this.router.navigate(['/dashboard'])
		}
	}

}
