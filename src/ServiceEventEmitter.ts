import {AnyEventListenerCallback, EmitsEvents, EventListenerCallback, EventListenerType, ServiceWithEvents} from "./EmitsEvents";
import {StorageServiceType} from "./StorageService";

export class ServiceEventEmitter implements ServiceWithEvents {
	protected eventHandler: EmitsEvents;

	constructor(prefix: string, type: StorageServiceType) {
		this.eventHandler = new EmitsEvents(prefix, type);
	}

	public off(event: EventListenerType, key: string, listenerId: number) {
		this.eventHandler.off(event, key, listenerId);
	}

	public offAdd(key: string, listenerId: number) {
		this.eventHandler.offAdd(key, listenerId);
	}

	public offChange(key: string, listenerId: number) {
		this.eventHandler.offChange(key, listenerId);
	}

	public offDelete(key: string, listenerId: number) {
		this.eventHandler.offDelete(key, listenerId);
	}

	public on<T>(event: EventListenerType, key: string, callback: EventListenerCallback<T>): number {
		return this.eventHandler.on<T>(event, key, callback);
	}

	public onAdd<T>(key: string, callback: EventListenerCallback<T>): number {
		return this.eventHandler.onAdd<T>(key, callback);
	}

	public onChange<T>(key: string, callback: EventListenerCallback<T>): number {
		return this.eventHandler.onChange<T>(key, callback);
	}

	public onDelete<T>(key: string, callback: EventListenerCallback<T>): number {
		return this.eventHandler.onDelete<T>(key, callback);
	}

	public onAny<T>(callback: AnyEventListenerCallback<T>): number {
		return this.eventHandler.onAny<T>(callback);
	}

	public offAny<T>(listenerId: number) {
		this.eventHandler.offAny<T>(listenerId);
	}
}
