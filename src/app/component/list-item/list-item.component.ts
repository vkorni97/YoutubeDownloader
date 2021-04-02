import { animate, group, query, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FileInfo } from 'src/app/model/file-info.model';

@Component({
	selector: 'app-list-item',
	templateUrl: './list-item.component.html',
	styleUrls: [ './list-item.component.scss' ],
	animations: [
		trigger('animateIn', [
			transition(':enter', [
				style({ opacity: 0, transform: 'translate3d(-100%, 0, 0)' }),
				animate('.25s .5s ease-in', style('*'))
			])
		])
	]
})
export class ListItemComponent implements OnInit {
	@Input() item: FileInfo;
	@Output() removeItem: EventEmitter<string> = new EventEmitter<string>();
	@Output() downloadItem: EventEmitter<string> = new EventEmitter<string>();

	constructor() {}

	ngOnInit(): void {}

	handleItemRemove() {
		this.removeItem.emit();
	}

	handleItemDownload() {
		this.downloadItem.emit();
	}
}
