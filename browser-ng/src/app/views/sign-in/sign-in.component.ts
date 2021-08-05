import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NearService } from '../../services/near.service'

@Component({
	selector: 'app-sign-in',
	templateUrl: './sign-in.component.html',
	styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

	constructor(private near_: NearService, private router: Router) { }

	ngOnInit(): void {
		if (this.near_.isSignedIn()) {
			this.router.navigate(['/dashboard'])
		}
	}

	signIn() {
		this.near_.signIn();
	}

}
