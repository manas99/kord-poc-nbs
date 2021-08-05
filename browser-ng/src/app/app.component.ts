import { Component } from '@angular/core';

import { NearService } from './services/near.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {

	constructor(public near_: NearService) { }

	ngOnInit() {

	}

}
