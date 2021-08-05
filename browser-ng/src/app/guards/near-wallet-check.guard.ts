import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { NearService } from '../services/near.service';

@Injectable({
	providedIn: 'root'
})
export class NearWalletCheckGuard implements CanActivate {

	constructor(private near_: NearService, private router: Router) { }

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		if (this.near_.isSignedIn()) {
			return true;
		} else {
			this.router.navigate(['/sign-in'])
			return false;
		}
	}

}
