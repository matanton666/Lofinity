import EventEmitter from '../utils/EventEmitter.js';

class PresetManager extends EventEmitter {
    constructor(storageProvider) {
        super();
        this.storageProvider = storageProvider;
        // No presets loaded
        this.presets = [];
    }

    getPresets() {
        return [];
    }

    selectPreset(presetId) {
        // No-op: no presets available
    }
}

export default PresetManager;
