import { EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';
import { Options } from '../interface/all';

@Injectable({
	providedIn: 'root'
})
export class StoreService {
	public options: EventEmitter<Options> = new EventEmitter<Options>(null);
	constructor() {}
}
