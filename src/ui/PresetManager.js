import EventEmitter from '../utils/EventEmitter.js';
import presets from '../data/presets.js';

class PresetManager extends EventEmitter {
    constructor(storageProvider) {
        super();
        this.storageProvider = storageProvider;
        this.presets = presets;
    }

    getPresets() {
        return this.presets;
    }

    selectPreset(presetId) {
        const preset = this.presets.find(p => p.id === presetId);
        if (preset) {
            this.emit('preset:selected', preset);
        }
    }
}

export default PresetManager;
