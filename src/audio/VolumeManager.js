import EventEmitter from '../utils/EventEmitter.js';

class VolumeManager extends EventEmitter {
    constructor() {
        super();
        this.volumes = {
            master: 1.0,
            music: 1.0,
            // Add more sound types as needed
        };
    }

    setVolume(type, value) {
        this.volumes[type] = value;
        this.emit('volume:change', type, value);
    }

    getVolume(type) {
        return this.volumes[type] !== undefined ? this.volumes[type] : 1.0;
    }
}

export default VolumeManager;
