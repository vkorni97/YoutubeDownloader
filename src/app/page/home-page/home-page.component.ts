import { animate, query, style, transition, trigger } from '@angular/animations';
import { Component, NgZone, OnInit } from '@angular/core';
import { ListItemActions } from 'src/app/interface/all';
import { FileInfo } from 'src/app/model/file-info.model';
import { UtilsService } from 'src/app/service/utils.service';
import { downloadOptions } from 'ytdl-core';

@Component({
	selector: 'app-home-page',
	templateUrl: './home-page.component.html',
	styleUrls: [ './home-page.component.scss' ],
	animations: [
		trigger('animateIn', [
			transition(':enter', [
				style({ opacity: 0, transform: 'translate3d(-40px, 0, 0)' }),
				query('.thumbContainer .time', [ style({ opacity: 0, transform: 'translate3d(-100%, 0, 0)' }) ]),
				animate('.25s ease-in', style('*')),
				query('.thumbContainer .time', [ animate('.25s .25s ease-out', style('*')) ])
			]),
			transition(':leave', [
				animate('.25s ease-out', style({ opacity: 0, transform: 'translate3d(40px, 0, 0)' }))
			])
		]),
		trigger('animateInMini', [
			transition(':enter', [
				style({ opacity: 0, transform: 'translate3d(-40px, 0, 0)' }),
				animate('.25s ease-in', style('*'))
			]),
			transition(':leave', [
				animate('.25s ease-out', style({ opacity: 0, transform: 'translate3d(40px, 0, 0)' }))
			])
		])
	]
})
export class HomePageComponent implements OnInit {
	public onQueue: FileInfo[] = [];
	public completed: FileInfo[] = [];

	constructor(private utils: UtilsService, private zone: NgZone) {
		this.utils.ipcRenderer.on('link', (_, link) => {
			this.zone.run(() => {
				this.checkLink(link);
			});
		});
		JSON.parse(localStorage.getItem('links') || '[]').forEach((link) => {
			this.checkLink(link);
		});
	}

	ngOnInit(): void {}

	private async checkLink(link: string) {
		if (link.includes('channel') || link.includes('list')) {
			//console.log(link);
			let list = await this.utils.ytpl(link, { limit: 20 });
			console.log(list);
		} else {
			this.addToList(link);
		}
	}

	private addToList(link: string) {
		this.utils.ytdl.getBasicInfo(link).then((info) => {
			if (!this.onQueue.some((i) => i.url == info.videoDetails.video_url)) {
				this.onQueue.push(
					new FileInfo({
						created_at: new Date().getTime(),
						info: info,
						url: info.videoDetails.video_url,
						path: `C:\\Users\\Kornel\\Music\\${info.videoDetails.title.replace(/[*'/":<>?\\|]/g, '_')}.mp3`
					})
				);
			}
		});
	}

	handleItemRemove(item: FileInfo, type: 'onQueue' | 'completed') {
		this[type] = this[type].filter((i) => i.url !== item.url);
		if (type == 'onQueue') localStorage.setItem('links', JSON.stringify(this.onQueue.map((i) => i.url)));
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
					highWaterMark: 0
				};
				if (!this.utils.fs.existsSync(item.path)) {
					item.downloading = true;
					item.audio = this.utils
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
					item.convert = this.utils.ffmpeg(item.audio).toFormat('mp3').save(item.path);
					item.convert
						.on('start', () => {
							item.pid = item.convert['ffmpegProc'].pid;
						})
						.on('end', () => {
							this.zone.run(() => {
								this.completed.push(item);
								this.onQueue = this.onQueue.filter((i) => i != item);
								localStorage.setItem('links', JSON.stringify(this.onQueue.map((i) => i.url)));
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
					this.onQueue = this.onQueue.filter((i) => i != item);
					localStorage.setItem('links', JSON.stringify(this.onQueue.map((i) => i.url)));
				}
			}
		}
	}
}
