import { animate, group, query, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FileInfo } from 'src/app/model/file-info.model';
import { videoInfo } from 'ytdl-core';

@Component({
	selector: 'app-list-item',
	templateUrl: './list-item.component.html',
	styleUrls: [ './list-item.component.scss' ],
	animations: []
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
