import { Component, NgZone } from '@angular/core';
import { UtilsService } from './service/utils.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: [ './app.component.scss' ]
})
export class AppComponent {
	title = 'YoutubeDownloader';

	constructor(private utils: UtilsService) {}

	handleWindowOperation(operation: 'minimize' | 'fullscreen' | 'close') {
		this.utils.ipcRenderer.send(operation);
	}
}
