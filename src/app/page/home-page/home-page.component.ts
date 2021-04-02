import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ListItemActions, Options } from 'src/app/interface/all';
import { FileInfo } from 'src/app/model/file-info.model';
import { StoreService } from 'src/app/service/store.service';
import { UtilsService } from 'src/app/service/utils.service';
import { downloadOptions } from 'ytdl-core';

@Component({
	selector: 'app-home-page',
	templateUrl: './home-page.component.html',
	styleUrls: [ './home-page.component.scss' ]
})
export class HomePageComponent implements OnInit, OnDestroy {
	public downloading: FileInfo[] = [];
	public completed: FileInfo[] = [];
	public onQueue: string[] = [];
	public isLoading: boolean;

	private subscription: Subscription;
	private options: Options;

	constructor(private utils: UtilsService, private zone: NgZone, private store: StoreService) {
		this.subscription = this.store.options.subscribe((dt) => {
			console.log(dt);
			if (dt) this.options = dt;
		});
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}

	ngOnInit(): void {
		this.utils.ipcRenderer.on('link', (_, link) => {
			this.zone.run(() => {
				this.checkLink(link);
			});
		});
		let links: string[] = JSON.parse(localStorage.getItem('links') || '[]');
		if (links.length) {
			this.onQueue = [ ...this.onQueue, ...links ];
			if (!this.isLoading) {
				this.isLoading = true;
				this.addList(this.onQueue.splice(0, 5));
			}
		}
	}

	private async checkLink(link: string) {
		if (link.includes('channel') || link.includes('list')) {
			try {
				let list = await this.utils.ytpl(link, { limit: this.options.playlist.size });
				if (list.items.length) {
					this.onQueue = [ ...this.onQueue, ...list.items.map((v) => v.shortUrl) ];
					if (!this.isLoading) {
						this.isLoading = true;
						this.addList(this.onQueue.splice(0, 5));
					}
				}
			} catch (error) {
				this.addToList(link);
			}
		} else {
			this.addToList(link);
		}
	}

	private addList(list: string[]) {
		for (let i = 0; i < list.length; i++) {
			this.recursiveAdd(list[i], i);
		}
	}

	private recursiveAdd(link: string, i: number) {
		this.addToList(link).then(() => {
			if (this.onQueue.length) this.recursiveAdd(this.onQueue.shift(), i);
			else this.isLoading = false;
		});
	}

	private addToList(link: string) {
		return new Promise((resolve, reject) => {
			this.utils.ytdl.getBasicInfo(link).then((info) => {
				if (!this.downloading.some((i) => i.url == info.videoDetails.video_url)) {
					this.downloading = [
						...this.downloading,
						new FileInfo({
							created_at: new Date().getTime(),
							file_duration: info.videoDetails.lengthSeconds,
							file_thumbnail: info.videoDetails.thumbnails.shift().url,
							file_title: info.videoDetails.title,
							url: info.videoDetails.video_url,
							path: `${this.options.path}${info.videoDetails.title.replace(/[*'/":<>?\\|]/g, '_')}.mp3`
						})
					];
					console.log(this.downloading);
					resolve(true);
				}
			});
		});
	}

	handleItemRemove(item: FileInfo, type: string) {
		this[type] = this[type].filter((i) => i.url !== item.url);
		if (type == 'downloading') this.saveLinks();
	}

	private saveLinks() {
		localStorage.setItem('links', JSON.stringify(this.downloading.map((i) => i.url)));
	}

	handleFolderOpen(action: ListItemActions, item: FileInfo) {
		this.utils.ipcRenderer.send(action, item.path);
	}

	handleDownloadItem(item: FileInfo) {
		if (item.downloading) {
			item.downloading = false;
			this.utils.pauseProcess(item.convert['ffmpegProc']);
		} else {
			if (item.convert) {
				item.downloading = true;
				this.utils.resumeProcess(item.convert['ffmpegProc']);
			} else {
				var options: downloadOptions = {
					quality: 'highest',
					filter: 'audio',
					highWaterMark: 1024 * 1024 * 1024
				};
				if (!this.utils.fs.existsSync(item.path)) {
					item.downloading = true;
					let audio = this.utils
						.ytdl(item.url, options)
						.on('progress', (length, downloaded, totallength) => {
							//if (!item.downloading) item.audio.pause();
							let progress = Math.round(downloaded / totallength * 100);
							if (progress != item.progress) {
								this.zone.run(() => {
									item.progress = progress;
								});
							}
						})
						.on('error', (err) => console.log(err));
					item.convert = this.utils.ffmpeg(audio).toFormat('mp3').save(item.path);
					item.convert
						.on('start', () => {
							item.pid = item.convert['ffmpegProc'].pid;
						})
						.on('end', () => {
							audio = undefined;
							this.zone.run(() => {
								this.completed.push(item);
								this.downloading = this.downloading.filter((i) => i != item);
								localStorage.setItem('links', JSON.stringify(this.downloading.map((i) => i.url)));
							});
						})
						.on('error', (err) => {
							console.log(err);
						});
					//console.log(JSON.parse(JSON.stringify(item.convert)));
					// item.audio.pipe(this.utils.fs.createWriteStream(item.path)).on('close', () => {
					// 	this.utils.ffmpeg().input(item.path).toFormat('mp3');
					// });
					// item.convert = this.utils
					// 	.ffmpeg(item.audio)
					// 	.toFormat('mp3')
					// 	// .audioBitrate(audioBitrate.toString())
					// 	.save(item.path)
					// 	.on('error', (err) => {
					// 		//if (this.state.isDownloading) this.startDownload();
					// 		console.log(err);
					// 	})
					// 	.on('end', () => {
					// 		this.zone.run(() => {
					// 			this.completed.push(item);
					// 			this.onQueue = this.onQueue.filter((i) => i != item);
					// 			localStorage.setItem('links', JSON.stringify(this.onQueue.map((i) => i.url)));
					// 			// item.completed = true;
					// 		});
					// 		// this.savedPath = item.path;
					// 		// const writer = new ID3Writer(
					// 		// 	fs.readFileSync(file + '_downloading.mp3')
					// 		// );
					// 		// var title = this.state.info.player_response.videoDetails.title.split(
					// 		// 	'-'
					// 		// );
					// 		// writer
					// 		// 	.setFrame('TIT2', title[1] || '')
					// 		// 	.setFrame('TPE1', [ title[0] ])
					// 		// 	.setFrame('APIC', {
					// 		// 		type: 3,
					// 		// 		data: fs.readFileSync(albumCover),
					// 		// 		description: 'Cover'
					// 		// 	});
					// 		// writer.addTag();
					// 		// fs.writeFileSync(this.savedPath, Buffer.from(writer.arrayBuffer));
					// 		// fs.unlinkSync(file + '_downloading.mp3');
					// 		// fs.unlinkSync(albumCover);
					// 		// this.destroy(item.path);
					// 	});
				} else {
					this.completed.push(item);
					this.downloading = this.downloading.filter((i) => i != item);
					localStorage.setItem('links', JSON.stringify(this.downloading.map((i) => i.url)));
				}
			}
		}
	}
}
