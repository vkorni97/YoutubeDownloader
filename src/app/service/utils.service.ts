import { Injectable } from '@angular/core';
import { IpcRenderer } from 'electron';
import * as ytdl from 'ytdl-core';
import * as ytpl from 'ytpl';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import { ChildProcess } from 'child_process';

@Injectable({
	providedIn: 'root'
})
export class UtilsService {
	public ipcRenderer: IpcRenderer;
	public ytdl: typeof ytdl;
	public ffmpeg: typeof ffmpeg;
	public fs: typeof fs;
	public ytpl: typeof ytpl;

	private isWin32: boolean = process.platform == 'win32';
	constructor() {
		this.ytdl = (<any>window).ytdl;
		this.ipcRenderer = (<any>window).require('electron').ipcRenderer;
		this.ffmpeg = (<any>window).ffmpeg;
		this.fs = (<any>window).fs;
		this.ytpl = (<any>window).ytpl;
	}

	pauseProcess(process: ChildProcess) {
		if (this.isWin32) this.ipcRenderer.send('stopFFMPEG', process.pid);
		else process.kill('SIGSTOP');
	}

	resumeProcess(process: ChildProcess) {
		if (this.isWin32) this.ipcRenderer.send('startFFMPEG', process.pid);
		else process.kill('SIGCONT');
	}
}
