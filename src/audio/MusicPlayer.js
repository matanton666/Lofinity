import EventEmitter from '../utils/EventEmitter.js';
import audioConfig from '../data/audioConfig.js';

class MusicPlayer extends EventEmitter {
    constructor(audioContext, assetLoader, masterGain, preloadedBuffers = {}) {
        super();
        this.audioContext = audioContext;
        this.assetLoader = assetLoader;
        this.masterGain = masterGain;
        this.source = null;
        this.buffer = null;
        this.isPlayingFlag = false;
        this.volume = 1.0;
        this.gainNode = this.audioContext.createGain();
        this.gainNode.connect(this.masterGain);
        this.currentCategory = null;
        this.trackQueue = [];
        this.currentTrackUrl = null;
        this.preloadedBuffers = preloadedBuffers; // url -> AudioBuffer
        this.musicPrefetching = false;
    }

    setPreloadedBuffers(preloadedBuffers) {
        this.preloadedBuffers = preloadedBuffers;
    }

    async _prefetchNextTrack() {
        if (!this.trackQueue.length) return;
        const nextUrl = this.trackQueue[this.trackQueue.length - 1];
        if (!this.preloadedBuffers[nextUrl]) {
            const arrayBuffer = await this.assetLoader.load(nextUrl);
            this.preloadedBuffers[nextUrl] = await this.audioContext.decodeAudioData(arrayBuffer);
        }
    }

    setCategory(category) {
        this.currentCategory = category;
        this._resetQueue();
    }

    _resetQueue() {
        const tracks = audioConfig.music[this.currentCategory] || [];
        // Shuffle tracks for random order
        this.trackQueue = tracks.slice();
        for (let i = this.trackQueue.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.trackQueue[i], this.trackQueue[j]] = [this.trackQueue[j], this.trackQueue[i]];
        }
    }

    async _playNextRandomTrack() {
        if (!this.trackQueue.length) this._resetQueue();
        if (!this.trackQueue.length) return; // No tracks
        this.currentTrackUrl = this.trackQueue.pop();
        await this.load(this.currentTrackUrl);
        await this.play(true); // true = auto
        // Prefetch the next track in the background
        this._prefetchNextTrack();
    }

    async load(sourceUrl) {
        // Use preloaded buffer if available
        if (this.preloadedBuffers && this.preloadedBuffers[sourceUrl]) {
            this.buffer = this.preloadedBuffers[sourceUrl];
        } else {
            const arrayBuffer = await this.assetLoader.load(sourceUrl);
            this.buffer = await this.audioContext.decodeAudioData(arrayBuffer);
            this.preloadedBuffers[sourceUrl] = this.buffer;
        }
        this.emit('music:loaded', sourceUrl);
    }

    async play(auto = false) {
        if (!this.buffer) return;
        this.stop();
        this.source = this.audioContext.createBufferSource();
        this.source.buffer = this.buffer;
        this.source.loop = false; // No loop, auto-advance
        this.source.connect(this.gainNode);
        this.source.onended = () => {
            if (this.isPlayingFlag) {
                this._playNextRandomTrack();
            }
        };
        this.source.start(0);
        this.isPlayingFlag = true;
        this.emit('statechange', auto ? 'auto-next' : 'playing');
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

    playCategory(category) {
        // If already playing this category, do nothing
        if (this.currentCategory === category && this.isPlaying()) {
            return;
        }
        // Always stop any current playback before starting new
        this.stop();
        this.setCategory(category);
        this._playNextRandomTrack();
    }

    async skipToNext() {
        this.stop();
        if (!this.trackQueue.length) this._resetQueue();
        if (!this.trackQueue.length) return;
        this.currentTrackUrl = this.trackQueue.pop();
        await this.load(this.currentTrackUrl);
        await this.play();
    }

    async skipToPrevious() {
        // For simplicity, just reshuffle and play a new random track
        this.stop();
        this._resetQueue();
        if (!this.trackQueue.length) return;
        this.currentTrackUrl = this.trackQueue.pop();
        await this.load(this.currentTrackUrl);
        await this.play();
    }
}

export default MusicPlayer;
