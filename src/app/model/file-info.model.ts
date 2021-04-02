import type { FfmpegCommand } from "fluent-ffmpeg";
import type { Readable } from 'stream';
import type { videoInfo } from 'ytdl-core';

export class FileInfo {
	created_at: number;
	file_thumbnail: string;
	file_title: string;
	file_duration: string;
	convert: FfmpegCommand = undefined;
	pid: number;
	downloading: boolean = false;
	progress: number = 0;
	url: string;
	path: string;

	constructor(item: Partial<FileInfo>) {
		Object.assign(this, item);
	}
}
