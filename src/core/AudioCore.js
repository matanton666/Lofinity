import EventEmitter from '../utils/EventEmitter.js';
import MusicPlayer from '../audio/MusicPlayer.js';
import AmbientSoundManager from '../audio/AmbientSoundManager.js';
import VolumeManager from '../audio/VolumeManager.js';

class AudioCore extends EventEmitter {
    constructor(assetLoader, storageProvider) {
        super();
        this.assetLoader = assetLoader;
        this.storageProvider = storageProvider;
        this.audioContext = null;
        this.masterGain = null;
        this.musicPlayer = null;
        this.ambientManager = null;
        this.volumeManager = null;
        this.isInitialized = false;
    }

    async initialize() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.audioContext.createGain();
        this.masterGain.connect(this.audioContext.destination);
        this.volumeManager = new VolumeManager();
        this.musicPlayer = new MusicPlayer(this.audioContext, this.assetLoader, this.masterGain);
        this.ambientManager = new AmbientSoundManager(this.audioContext, this.assetLoader, this.masterGain);
        this.isInitialized = true;
        this.setMasterVolume(this.volumeManager.getVolume('master'));
    }

    async playMusic(category, trackUrl) {
        await this.musicPlayer.load(trackUrl);
        await this.musicPlayer.play();
    }

    async toggleAmbientSound(soundId, sourceUrl) {
        await this.ambientManager.toggleAmbientSound(soundId, sourceUrl);
    }

    setMasterVolume(volume) {
        if (this.masterGain) {
            this.masterGain.gain.value = volume;
        }
        if (this.volumeManager) {
            this.volumeManager.setVolume('master', volume);
        }
    }

    getCurrentState() {
        // Return current audio state for persistence
        return {
            music: this.musicPlayer ? this.musicPlayer.isPlaying() : false,
            ambient: Array.from(this.ambientManager.sounds.keys()),
            volumes: this.volumeManager ? this.volumeManager.volumes : {},
        };
    }

    restoreState(state) {
        // Restore audio state from storage (to be implemented)
    }
}

export default AudioCore;
