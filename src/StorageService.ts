export interface StorageService {

	/**
	 * Store a new item in local storage
	 *
	 * @param {string} key
	 * @param {any} value
	 * @param {Date} expiresAt
	 */
	set(key: string, value: any, expiresAt?: Date);

	/**
	 * Store a new item in local storage
	 *
	 * @param {string} key
	 * @param {any} value
	 */
	set(key: string, value: any);

	/**
	 * Store a new item in local storage
	 *
	 * @param {string} key
	 * @param {T} value
	 */
	set<T>(key: string, value: T);

	/**
	 * Delete a specific item by key
	 *
	 * @param {string} key
	 */
	delete<T>(key: string);

	/**
	 * Get an item from local storage, correctly typed.
	 *
	 * @param {string} key
	 * @returns {T | null}
	 */
	get<T>(key: string): T | null;

	/**
	 * Get an item from local storage, correctly typed.
	 *
	 * @param {string} key
	 * @param {T} defaultValue
	 * @returns {T | null}
	 */
	get<T>(key: string, defaultValue: T): T | null;

	/**
	 * Get an item from local storage, correctly typed.
	 *
	 * @param {string} key
	 * @param {T} defaultValue
	 * @returns {T | null}
	 */
	get<T>(key: string, defaultValue?: T): T | null;

	/**
	 * Set the prefix for this local storage instance
	 *
	 * @param {string} prefix
	 */
	setPrefix(prefix: string);

	/**
	 * Pass a key for a local storage item we want to access, it will add the prefix.
	 *
	 * @param {string} key
	 * @returns {string}
	 */
	getKeyWithPrefix(key: string): string;

	/**
	 * Check if the item exists
	 *
	 * @param {string} key
	 * @returns {boolean}
	 */
	exists(key: string): boolean;

	/**
	 * If the item exists get it, if it doesn't, create it
	 * @param {string} key
	 * @param {T} value
	 * @returns {T}
	 */
	getOrCreate<T>(key: string, value: T): T;

	/**
	 * If the item exists, update and get it, if it doesn't, create it and return it
	 *
	 * @param {string} key
	 * @param {T} value
	 * @returns {T}
	 */
	getOrUpdate<T>(key: string, value: T): T;

	/**
	 * Clear all items from localStorage that are using our prefix
	 */
	clear();

}

export type StoredItem<T extends any> = {
	value: T;
	expiresAt?: Date | undefined
}


export enum StorageServiceType {
	MEMORY = 'MemoryStorage',
	LOCAL  = 'LocalStorage',
}
