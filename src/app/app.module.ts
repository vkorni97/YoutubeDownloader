import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatIconModule } from '@angular/material/icon';
import { UtilsService } from './service/utils.service';
import { HomePageComponent } from './page/home-page/home-page.component';
import { ListItemComponent } from './component/list-item/list-item.component';
import { ButtonComponent } from './component/button/button.component';
import { TimePipe } from './pipe/time.pipe';
import { ProgressBarComponent } from './component/progress-bar/progress-bar.component';
import { MiniListItemComponent } from './component/mini-list-item/mini-list-item.component';

@NgModule({
	declarations: [ AppComponent, HomePageComponent, ListItemComponent, ButtonComponent, TimePipe, ProgressBarComponent, MiniListItemComponent ],
	imports: [ BrowserModule, AppRoutingModule, BrowserAnimationsModule, MatIconModule ],
	providers: [ UtilsService ],
	bootstrap: [ AppComponent ]
})
export class AppModule {}
