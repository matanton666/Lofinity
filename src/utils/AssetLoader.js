class AssetLoader {
    constructor() {
        this.cache = new Map();
    }

    async load(url) {
        if (this.cache.has(url)) {
            // Return a copy of the cached buffer to avoid detached buffer issues
            const cached = this.cache.get(url);
            return cached.slice(0);
        }
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to load asset: ' + url);
        const arrayBuffer = await response.arrayBuffer();
        this.cache.set(url, arrayBuffer);
        return arrayBuffer.slice(0); // Always return a copy
    }

    getLoadProgress() {
        // (Future) Implement progress tracking
        return 1.0;
    }
}

export default AssetLoader;
