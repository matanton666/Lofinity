class AssetLoader {
    constructor() {
        this.cache = new Map();
    }

    async load(url) {
        if (this.cache.has(url)) {
            return this.cache.get(url);
        }
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to load asset: ' + url);
        const arrayBuffer = await response.arrayBuffer();
        this.cache.set(url, arrayBuffer);
        return arrayBuffer;
    }

    getLoadProgress() {
        // (Future) Implement progress tracking
        return 1.0;
    }
}

export default AssetLoader;
