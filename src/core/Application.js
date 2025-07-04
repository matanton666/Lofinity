import StorageProvider from './StorageProvider.js';
import AudioCore from './AudioCore.js';
import UIController from './UIController.js';
import BackgroundManager from '../ui/BackgroundManager.js';
import AssetLoader from '../utils/AssetLoader.js';

class Application {
    constructor() {
        this.config = null;
        this.initialized = false;
        this.storage = new StorageProvider();
        this.assetLoader = new AssetLoader();
        this.audioCore = null;
        this.backgroundManager = null;
        this.uiController = null;
    }

    async initialize(config = {}) {
        this.config = config;
        // Load user preferences
        this.preferences = this.storage.get('lofinity_preferences') || {};
        // Initialize core modules
        this.audioCore = new AudioCore(this.assetLoader, this.storage);
        await this.audioCore.initialize();
        this.backgroundManager = new BackgroundManager();
        this.uiController = new UIController(
            this.audioCore,
            this.backgroundManager
        );
        this.initialized = true;
        console.log('Application initialized', this.preferences);
    }

    async start() {
        // (Future) Start audio system, UI, etc.
        if (this.uiController) this.uiController.initialize();
        console.log('Application started');
    }

    destroy() {
        // Clean up resources if needed
        this.initialized = false;
    }
}

export default Application;
