import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ListItemActions } from 'src/app/interface/all';
import { FileInfo } from 'src/app/model/file-info.model';

@Component({
	selector: 'app-mini-list-item',
	templateUrl: './mini-list-item.component.html',
	styleUrls: [ './mini-list-item.component.scss' ]
})
export class MiniListItemComponent implements OnInit {
	@Input() item: FileInfo;
	@Output() handleAction: EventEmitter<ListItemActions> = new EventEmitter<ListItemActions>();
	constructor() {}

	ngOnInit(): void {}

	handleItemAction(str: ListItemActions) {
		this.handleAction.emit(str);
	}
}
