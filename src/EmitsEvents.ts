import {StorageServiceType} from "./StorageService";

export type EventListenerCallback<T> = (value: T, newValue?: T | undefined) => void;

export type KeyListenerObject = {
	[key: number]: EventListenerCallback<any>;
}

export enum EventListenerType {
	CHANGE = 'change',
	DELETE = 'delete',
	ADD    = 'add',
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
}

export class EmitsEvents {

	constructor(public prefix: string, public storageServiceType: StorageServiceType) { }

	private listeners: Record<string, KeyListenerObject> = {};

	private key(event: EventListenerType, key: string) {
		return `${this.storageServiceType}:${this.prefix}:${event}:${key}`;
	}

	public on<T>(event: EventListenerType, key: string, callback: EventListenerCallback<T>): number {
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

	public emit(type: EventListenerType, key: string, value: any, newValue?: any) {
		key = this.key(type, key);

		if (!this.listeners[key]) {
			return;
		}

		for (let listenerKey in this.listeners[key]) {
			console.log(key, listenerKey, value, newValue);
			this.listeners[key][listenerKey](value, newValue ?? undefined);
		}
	}

}
