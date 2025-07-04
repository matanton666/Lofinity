class StorageProvider {
    constructor() {
        this.storage = window.localStorage;
    }

    get(key) {
        try {
            const value = this.storage.getItem(key);
            return value ? JSON.parse(value) : null;
        } catch (e) {
            return null;
        }
    }

    set(key, value) {
        try {
            this.storage.setItem(key, JSON.stringify(value));
        } catch (e) {
            // handle error
        }
    }

    remove(key) {
        this.storage.removeItem(key);
    }

    clear() {
        this.storage.clear();
    }

    exists(key) {
        return this.storage.getItem(key) !== null;
    }
}

export default StorageProvider;
