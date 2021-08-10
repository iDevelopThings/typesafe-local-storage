import {StorageService, StorageServiceType, StoredItem} from "./StorageService";
import {StorageServiceWithEventsImpl} from "./StorageServiceWithEventsImpl";

let MemoryStoragePrefix = 'ls:';

class MemoryStorageService implements StorageService {

	private values: Record<string, StoredItem<any>> = {};

	/**
	 * Clear all items from memory storage
	 */
	clear() {
		for (let valuesKey in this.values) {
			this.delete(valuesKey.replace(MemoryStoragePrefix, ''));
		}
	}

	/**
	 * Delete a specific item by key
	 *
	 * @param {string} key
	 */
	delete<T>(key: string) {
		if (!this.values.hasOwnProperty(this.getKeyWithPrefix(key))) {
			return;
		}

		delete this.values[this.getKeyWithPrefix(key)];
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

		const data: StoredItem<T> = this.values[this.getKeyWithPrefix(key)];

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
		this.values[this.getKeyWithPrefix(key)] = {
			value : value,
			expiresAt,
		};
	}

	/**
	 * Pass a key for a local storage item we want to access, it will add the prefix.
	 *
	 * @param {string} key
	 * @returns {string}
	 */
	getKeyWithPrefix(key: string): string {
		return `${MemoryStoragePrefix}${key}`;
	}

	/**
	 * Set the prefix for this local storage instance
	 *
	 * @param {string} prefix
	 */
	setPrefix(prefix: string) {
		MemoryStoragePrefix = prefix;
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

const MemoryStorage = new MemoryStorageService();

const MemoryStorageWithEvents = new StorageServiceWithEventsImpl(
	StorageServiceType.MEMORY,
	MemoryStorage
);

export {MemoryStorage, MemoryStorageWithEvents};

