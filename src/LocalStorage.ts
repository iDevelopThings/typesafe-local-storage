import {EventListenerType} from "./EmitsEvents";
import {ServiceEventEmitter} from "./ServiceEventEmitter";
import {StorageService, StorageServiceType, StoredItem} from "./StorageService";


let LocalStoragePrefix = 'ls:';

export class LocalStorageService extends ServiceEventEmitter implements StorageService {

	constructor() {
		super(LocalStoragePrefix, StorageServiceType.LOCAL);
	}

	/**
	 * Clear all items from localStorage that are using our prefix
	 */
	clear() {
		const values = Object.keys(localStorage);

		values
			.filter(key => key.startsWith(LocalStoragePrefix))
			.forEach(key => this.delete(key.replace(LocalStoragePrefix, '')));
	}

	/**
	 * Delete a specific item by key
	 *
	 * @param {string} key
	 */
	delete<T>(key: string) {
		this.eventHandler.emit(EventListenerType.DELETE, key, undefined);

		localStorage.removeItem(this.getKeyWithPrefix(key));
	}

	/**
	 * Get an item from local storage, correctly typed.
	 *
	 * @param {string} key
	 * @returns {T | null}
	 */
	get<T>(key: string): T | null;
	get<T>(key: string, defaultValue: T): T | null;
	get<T>(key: string, defaultValue?): T | null {
		const item: string | null = localStorage.getItem(this.getKeyWithPrefix(key));
		const data: StoredItem<T> = JSON.parse(item);

		const expiresAt = data?.expiresAt ? new Date(data?.expiresAt) : undefined;
		const value     = data?.value;

		if (expiresAt !== undefined) {
			const currentTime = new Date().getTime();

			if (currentTime > expiresAt.getTime()) {
				this.delete(key);

				return defaultValue;
			}
		}

		if (!value) {
			return defaultValue;
		}

		return value;
	}

	/**
	 * Store a new item in local storage
	 *
	 * @param {string} key
	 * @param {T|any} value
	 * @param {Date} expiresAt
	 */
	set(key: string, value: any, expiresAt?: Date)
	set(key: string, value: any);
	set<T>(key: string, value: T, expiresAt?: Date) {
		const exists                      = this.exists(key);
		const eventType                   = exists ? EventListenerType.CHANGE : EventListenerType.ADD;
		const [eventValue, newEventValue] = exists ? [this.get(key), value] : [value, undefined];

		this.eventHandler.emit(eventType, key, eventValue, newEventValue);

		localStorage.setItem(this.getKeyWithPrefix(key), JSON.stringify({
			value : value,
			expiresAt,
		}));
	}

	/**
	 * Pass a key for a local storage item we want to access, it will add the prefix.
	 *
	 * @param {string} key
	 * @returns {string}
	 */
	getKeyWithPrefix(key: string): string {
		return `${LocalStoragePrefix}${key}`;
	}

	/**
	 * Set the prefix for this local storage instance
	 *
	 * @param {string} prefix
	 */
	setPrefix(prefix: string) {
		LocalStoragePrefix = prefix;
	}

	/**
	 * Check if the item exists
	 *
	 * @param {string} key
	 * @returns {boolean}
	 */
	exists(key: string): boolean {
		return this.get(key, undefined) !== undefined;
	}

	/**
	 * If the item exists get it, if it doesn't, create it
	 *
	 * @param {string} key
	 * @param {T} value
	 * @returns {T}
	 */
	getOrCreate<T>(key: string, value: T): T {
		if (!this.exists(key)) {
			this.set(key, value);
		}

		return this.get<T>(key);
	}

	/**
	 *  If the item exists, update and get it, if it doesn't, create it and return it
	 *
	 * @param {string} key
	 * @param {T} value
	 * @returns {T}
	 */
	getOrUpdate<T>(key: string, value: T): T {
		this.set(key, value);

		return this.get<T>(key);
	}

}

const LocalStorage = new LocalStorageService();

export {LocalStorage};

