import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'time'
})
export class TimePipe implements PipeTransform {
	transform(second: number): string {
		return [ Math.floor(second / 3600), Math.floor((second % 3600) / 60), (second % 3600) % 60 ]
			.map((v) => (v < 10 ? `0${v}` : v))
			.join(':');
	}
}
