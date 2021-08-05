import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IndexComponent } from './views/index/index.component'
import { SignInComponent } from './views/sign-in/sign-in.component'
import { DashboardComponent } from './views/dashboard/dashboard.component'

import { NearWalletCheckGuard } from './guards/near-wallet-check.guard'

const routes: Routes = [
	{ path: '', component: IndexComponent },
	{ path: 'sign-in', component: SignInComponent },
	{ path: 'dashboard', component: DashboardComponent, canActivate: [NearWalletCheckGuard] },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
