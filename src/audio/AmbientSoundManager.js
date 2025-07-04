import EventEmitter from '../utils/EventEmitter.js';
import AmbientSound from './AmbientSound.js';

class AmbientSoundManager extends EventEmitter {
    constructor(audioContext, assetLoader, masterGain) {
        super();
        this.audioContext = audioContext;
        this.assetLoader = assetLoader;
        this.masterGain = masterGain;
        this.sounds = new Map(); // soundId -> AmbientSound
    }

    async toggleAmbientSound(soundId, sourceUrl) {
        if (this.sounds.has(soundId)) {
            this.sounds.get(soundId).stop();
            this.sounds.delete(soundId);
            this.emit('ambient:removed', soundId);
        } else {
            const sound = new AmbientSound(this.audioContext, this.assetLoader, this.masterGain);
            await sound.load(sourceUrl);
            sound.play();
            this.sounds.set(soundId, sound);
            this.emit('ambient:added', soundId);
        }
    }

    setVolume(soundId, volume) {
        if (this.sounds.has(soundId)) {
            this.sounds.get(soundId).setVolume(volume);
        }
    }

    stopAll() {
        for (const sound of this.sounds.values()) {
            sound.stop();
        }
        this.sounds.clear();
    }
}

export default AmbientSoundManager;
