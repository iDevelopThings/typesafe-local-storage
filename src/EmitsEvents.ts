import {StorageServiceType} from "./StorageService";

export type EventListenerCallback<T> = (value: T, newValue?: T | undefined) => void;
export type AnyEventListenerCallback<T> = (eventType: EventListenerType, key:string, value: T, newValue?: T | undefined) => void;

export type KeyListenerObject = {
	[key: number]: EventListenerCallback<any>|AnyEventListenerCallback<any>;
}

export enum EventListenerType {
	CHANGE = 'change',
	DELETE = 'delete',
	ADD    = 'add',
	ANY    = 'any',
}

export interface ServiceWithEvents {
	on<T>(event: EventListenerType, key: string, callback: EventListenerCallback<T>): number;

	off(event: EventListenerType, key: string, listenerId: number);

	onChange<T>(key: string, callback: EventListenerCallback<T>): number;

	offChange(key: string, listenerId: number);

	onAdd<T>(key: string, callback: EventListenerCallback<T>): number;

	offAdd(key: string, listenerId: number);

	onDelete<T>(key: string, callback: EventListenerCallback<T>): number;

	offDelete(key: string, listenerId: number);

	onAny<T>(callback: AnyEventListenerCallback<T>): number;

	offAny<T>(listenerId: number);
}

export class EmitsEvents {

	constructor(public prefix: string, public storageServiceType: StorageServiceType) { }

	private listeners: Record<string, KeyListenerObject> = {};

	private key(event: EventListenerType, key: string) {
		return `${this.storageServiceType}:${this.prefix}:${event}:${key}`;
	}

	public on<T>(event: EventListenerType, key: string, callback: EventListenerCallback<T>|AnyEventListenerCallback<T>): number {
		const onChangeKey = this.key(event, key);

		if (!this.listeners[onChangeKey]) {
			this.listeners[onChangeKey] = {};
		}

		const listenerId = Object.keys(this.listeners[onChangeKey]).length;

		this.listeners[onChangeKey][listenerId] = callback;

		return listenerId;
	}

	public off(event: EventListenerType, key: string, listenerId: number) {
		const eventKey = this.key(event, key);

		if (!this.listeners[eventKey]) {
			return;
		}

		if (!this.listeners[eventKey][listenerId]) {
			return;
		}

		delete this.listeners[eventKey][listenerId];
	}

	public onChange<T>(key: string, callback: EventListenerCallback<T>): number {
		return this.on<T>(
			EventListenerType.CHANGE,
			key,
			callback
		);
	}

	public offChange(key: string, listenerId: number) {
		this.off(EventListenerType.CHANGE, key, listenerId);
	}

	public onAdd<T>(key: string, callback: EventListenerCallback<T>): number {
		return this.on<T>(
			EventListenerType.ADD, key, callback
		);
	}

	public offAdd(key: string, listenerId: number) {
		this.off(EventListenerType.ADD, key, listenerId);
	}

	public onDelete<T>(key: string, callback: EventListenerCallback<T>): number {
		return this.on<T>(
			EventListenerType.DELETE, key, callback
		);
	}

	public offDelete(key: string, listenerId: number) {
		this.off(EventListenerType.DELETE, key, listenerId);
	}

	public onAny<T>(callback: AnyEventListenerCallback<T>): number {
		return this.on<T>(EventListenerType.ANY, 'any', callback);
	}

	public offAny<T>(listenerId: number) {
		this.off(EventListenerType.ANY, 'any', listenerId);
	}

	public emit(type: EventListenerType, key: string, value: any, newValue?: any) {
		const internalKey = this.key(type, key);

		if(type === EventListenerType.ANY) {
			return;
		}

		const anyKey =  this.key(EventListenerType.ANY, 'any');
		if(this.listeners[anyKey]) {
			for (let listenerKey in this.listeners[anyKey]) {
				this.listeners[anyKey][listenerKey](type, key, value, newValue ?? undefined)
			}
		}

		if (!this.listeners[internalKey]) {
			return;
		}

		for (let listenerKey in this.listeners[internalKey]) {
			this.listeners[internalKey][listenerKey](value, newValue ?? undefined, undefined, undefined);
		}
	}

	private emitAny(type: EventListenerType, key: string, value: any, newValue?: any) {

	}

}
