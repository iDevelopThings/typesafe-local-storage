import {StorageService} from "./StorageService";

export interface LocalStorageServiceInstance {}

export interface LocalStorageServiceStatic extends StorageService {
	new(): LocalStorageServiceInstance;
}

let LocalStoragePrefix = 'ls:';

const LocalStorage: LocalStorageServiceStatic = class implements LocalStorageServiceInstance {

	/**
	 * Clear all items from localStorage that are using our prefix
	 */
	public static clear() {
		const values = Object.keys(localStorage);

		values
			.filter(key => key.startsWith(LocalStoragePrefix))
			.forEach(key => localStorage.removeItem(key));
	}

	/**
	 * Delete a specific item by key
	 *
	 * @param {string} key
	 */
	public static deleteItem<T>(key: string) {
		localStorage.removeItem(this.getKeyWithPrefix(key));
	}

	/**
	 * Get an item from local storage, correctly typed.
	 *
	 * @param {string} key
	 * @returns {T | null}
	 */
	public static getItem<T>(key: string): T | null;
	public static getItem<T>(key: string, defaultValue: T): T | null;
	public static getItem<T>(key: string, defaultValue?): T | null {
		const item: string | null = localStorage.getItem(this.getKeyWithPrefix(key));

		const value: T | undefined = JSON.parse(item)?.value;

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
	 */
	public static setItem(key: string, value: any);
	public static setItem<T>(key: string, value: T) {
		localStorage.setItem(this.getKeyWithPrefix(key), JSON.stringify({value : value}));
	}

	/**
	 * Pass a key for a local storage item we want to access, it will add the prefix.
	 *
	 * @param {string} key
	 * @returns {string}
	 */
	public static getKeyWithPrefix(key: string): string {
		return `${LocalStoragePrefix}${key}`;
	}

	/**
	 * Set the prefix for this local storage instance
	 *
	 * @param {string} prefix
	 */
	public static setPrefix(prefix: string) {
		LocalStoragePrefix = prefix;
	}

	/**
	 * Check if the item exists
	 *
	 * @param {string} key
	 * @returns {boolean}
	 */
	public static exists(key: string): boolean {
		return !!localStorage[this.getKeyWithPrefix(key)];
	}

	/**
	 * If the item exists get it, if it doesn't, create it
	 *
	 * @param {string} key
	 * @param {T} value
	 * @returns {T}
	 */
	public static getOrCreate<T>(key: string, value: T): T {
		if (!this.exists(key)) {
			this.setItem(key, value);
		}

		return this.getItem<T>(key);
	}

	/** If the item exists, update and get it, if it doesn't, create it and return it
	 *
	 * @param {string} key
	 * @param {T} value
	 * @returns {T}
	 */
	public static getOrUpdate<T>(key: string, value: T): T {
		this.setItem(key, value);

		return this.getItem<T>(key);
	}

};

export default LocalStorage;

