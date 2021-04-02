import { Component, NgZone } from '@angular/core';
import { StoreService } from './service/store.service';
import { UtilsService } from './service/utils.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: [ './app.component.scss' ]
})
export class AppComponent {
	title = 'YoutubeDownloader';

	constructor(private utils: UtilsService, private store: StoreService) {
		this.utils.ipcRenderer.send('requestConfigPath');
		this.utils.ipcRenderer.on('configPath', (event, path) => {
			let data = this.utils.fs.readFileSync(path, 'utf8');
			this.store.options.next(JSON.parse(data));
		});
	}

	handleWindowOperation(operation: 'minimize' | 'fullscreen' | 'close') {
		this.utils.ipcRenderer.send(operation);
	}
}
