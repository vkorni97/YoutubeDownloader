import { Injectable } from '@angular/core';
import { IpcRenderer } from 'electron';

@Injectable({
	providedIn: 'root'
})
export class UtilsService {
	public ipcRenderer: IpcRenderer;

	constructor() {
		this.ipcRenderer = (<any>window).require('electron').ipcRenderer;
	}
}
