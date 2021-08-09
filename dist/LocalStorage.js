let LocalStoragePrefix = 'ls:';
const LocalStorage = class {
    /**
     * Clear all items from localStorage that are using our prefix
     */
    static clear() {
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
    static deleteItem(key) {
        localStorage.removeItem(this.getKeyWithPrefix(key));
    }
    static getItem(key, defaultValue) {
        const item = localStorage.getItem(this.getKeyWithPrefix(key));
        const value = JSON.parse(item)?.value;
        if (!value) {
            return defaultValue;
        }
        return value;
    }
    static setItem(key, value) {
        localStorage.setItem(this.getKeyWithPrefix(key), JSON.stringify({ value: value }));
    }
    /**
     * Pass a key for a local storage item we want to access, it will add the prefix.
     *
     * @param {string} key
     * @returns {string}
     */
    static getKeyWithPrefix(key) {
        return `${LocalStoragePrefix}${key}`;
    }
    /**
     * Set the prefix for this local storage instance
     *
     * @param {string} prefix
     */
    static setPrefix(prefix) {
        LocalStoragePrefix = prefix;
    }
    /**
     * Check if the item exists
     *
     * @param {string} key
     * @returns {boolean}
     */
    static exists(key) {
        return !!localStorage[this.getKeyWithPrefix(key)];
    }
    /**
     * If the item exists get it, if it doesn't, create it
     *
     * @param {string} key
     * @param {T} value
     * @returns {T}
     */
    static getOrCreate(key, value) {
        if (!this.exists(key)) {
            this.setItem(key, value);
        }
        return this.getItem(key);
    }
    /** If the item exists, update and get it, if it doesn't, create it and return it
     *
     * @param {string} key
     * @param {T} value
     * @returns {T}
     */
    static getOrUpdate(key, value) {
        this.setItem(key, value);
        return this.getItem(key);
    }
};
export default LocalStorage;
//# sourceMappingURL=LocalStorage.js.map