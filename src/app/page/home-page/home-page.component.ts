import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-home-page',
	templateUrl: './home-page.component.html',
	styleUrls: [ './home-page.component.scss' ],
	animations: [
		trigger('slideIn', [
			transition(':enter', [
				query('.animate', [
					style({ opacity: 0, transform: 'translate3d(0, 10px, 0)' }),
					stagger(1000, [ animate('.5s ease-out', style('*')) ])
				])
			])
		])
	]
})
export class HomePageComponent implements OnInit {
	constructor() {}

	ngOnInit(): void {}
}
