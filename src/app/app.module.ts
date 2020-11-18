import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatIconModule } from '@angular/material/icon';
import { UtilsService } from './service/utils.service';
import { HomePageComponent } from './page/home-page/home-page.component';

@NgModule({
	declarations: [ AppComponent, HomePageComponent ],
	imports: [ BrowserModule, AppRoutingModule, BrowserAnimationsModule, MatIconModule ],
	providers: [ UtilsService ],
	bootstrap: [ AppComponent ]
})
export class AppModule {}
