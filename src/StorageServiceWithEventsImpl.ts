import {EmitsEvents, EventListenerCallback, EventListenerType, ServiceWithEvents} from "./EmitsEvents";
import {StorageService, StorageServiceType} from "./StorageService";

export class StorageServiceWithEventsImpl implements ServiceWithEvents {

	private service: StorageService;
	private eventHandler: EmitsEvents;

	constructor(storageType: StorageServiceType, service: StorageService) {
		this.service      = service;
		this.eventHandler = new EmitsEvents(this.getKeyWithPrefix(''), storageType);
	}

	/**
	 * Clear all items the service
	 */
	clear() {
		this.service.clear();
	}

	/**
	 * Delete a specific item by key
	 *
	 * @param {string} key
	 */
	delete<T>(key: string) {
		this.eventHandler.emit(EventListenerType.DELETE, key, this.get(key));

		this.service.delete<T>(key);
	}

	/**
	 * Get an item, correctly typed.
	 *
	 * @param {string} key
	 * @returns {T | null}
	 */
	get<T>(key: string): T | null;
	get<T>(key: string, defaultValue: T): T | null;
	get<T>(key: string, defaultValue?): T | null {
		return this.service.get<T>(key, defaultValue);
	}

	/**
	 * Store a new item
	 *
	 * @param {string} key
	 * @param {T|any} value
	 * @param {Date} expiresAt
	 */
	set(key: string, value: any, expiresAt?: Date)
	set(key: string, value: any);
	set<T>(key: string, value: T, expiresAt?: Date) {
		const eventType                   = this.exists(key) ? EventListenerType.CHANGE : EventListenerType.ADD;
		const [eventValue, newEventValue] = this.exists(key) ? [this.get(key), value] : [value, undefined];

		this.eventHandler.emit(eventType, key, eventValue, newEventValue);

		this.service.set(key, value, expiresAt);
	}

	/**
	 * Pass a key for an item we want to access, it will add the prefix.
	 *
	 * @param {string} key
	 * @returns {string}
	 */
	getKeyWithPrefix(key: string): string {
		return this.service.getKeyWithPrefix(key);
	}

	/**
	 * Set the prefix for this storage instance
	 *
	 * @param {string} prefix
	 */
	setPrefix(prefix: string) {
		this.service.setPrefix(prefix);
	}

	/**
	 * Check if the item exists
	 *
	 * @param {string} key
	 * @returns {boolean}
	 */
	exists(key: string): boolean {
		return this.service.exists(key);
	}

	/**
	 * If the item exists get it, if it doesn't, create it
	 *
	 * @param {string} key
	 * @param {T} value
	 * @returns {T}
	 */
	getOrCreate<T>(key: string, value: T): T {
		return this.service.getOrCreate<T>(key, value);
	}

	/**
	 *  If the item exists, update and get it, if it doesn't, create it and return it
	 *
	 * @param {string} key
	 * @param {T} value
	 * @returns {T}
	 */
	getOrUpdate<T>(key: string, value: T): T {
		return this.service.getOrUpdate<T>(key, value);
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
}
