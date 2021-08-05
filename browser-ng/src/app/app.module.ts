import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { MainService } from './services/main.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IndexComponent } from './views/index/index.component';
import { SignInComponent } from './views/sign-in/sign-in.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';

@NgModule({
	declarations: [
		AppComponent,
		IndexComponent,
		SignInComponent,
		DashboardComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		FormsModule
	],
	providers: [
		MainService,
		{
			provide: APP_INITIALIZER,
			useFactory: (ds: MainService) => () => { return ds.load() },
			deps: [MainService],
			multi: true
		}
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
