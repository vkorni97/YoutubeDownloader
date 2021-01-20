window.ytdl = require('ytdl-core');
window.ytpl = require('ytpl');

let ffmpegPath = require('ffmpeg-static-electron').path;
import ffmpeg from 'fluent-ffmpeg';

if (process.env.npm_lifecycle_script) {
	ffmpegPath = ffmpegPath.replace('electron\\dist\\resources\\electron.asar\\renderer', 'ffmpeg-static-electron');
	ffmpeg.setFfmpegPath(ffmpegPath);
} else {
	ffmpegPath = ffmpegPath.replace('frontend', 'node_modules\\ffmpeg-static-electron');
	ffmpeg.setFfmpegPath(ffmpegPath.replace('app.asar', 'app.asar.unpacked'));
}

window.ffmpeg = ffmpeg;
window.fs = require('fs');
