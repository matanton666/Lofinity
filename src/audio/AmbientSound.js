import EventEmitter from '../utils/EventEmitter.js';

class AmbientSound extends EventEmitter {
    constructor(audioContext, assetLoader, masterGain) {
        super();
        this.audioContext = audioContext;
        this.assetLoader = assetLoader;
        this.masterGain = masterGain;
        this.source = null;
        this.buffer = null;
        this.gainNode = this.audioContext.createGain();
        this.gainNode.connect(this.masterGain);
        this.volume = 1.0;
        this.isPlayingFlag = false;
    }

    async load(sourceUrl) {
        const arrayBuffer = await this.assetLoader.load(sourceUrl);
        this.buffer = await this.audioContext.decodeAudioData(arrayBuffer);
    }

    play() {
        if (!this.buffer) return;
        this.stop();
        this.source = this.audioContext.createBufferSource();
        this.source.buffer = this.buffer;
        this.source.loop = true;
        this.source.connect(this.gainNode);
        this.source.start(0);
        this.isPlayingFlag = true;
        this.emit('statechange', 'playing');
    }

    pause() {
        if (this.source) {
            this.source.stop();
            this.isPlayingFlag = false;
            this.emit('statechange', 'paused');
        }
    }

    stop() {
        if (this.source) {
            this.source.stop();
            this.source.disconnect();
            this.source = null;
            this.isPlayingFlag = false;
            this.emit('statechange', 'stopped');
        }
    }

    setVolume(volume) {
        this.volume = volume;
        this.gainNode.gain.value = volume;
    }

    getVolume() {
        return this.volume;
    }

    isPlaying() {
        return this.isPlayingFlag;
    }

    onStateChange(callback) {
        this.on('statechange', callback);
    }
}

export default AmbientSound;
