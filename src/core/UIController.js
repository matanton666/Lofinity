import EventEmitter from '../utils/EventEmitter.js';

class UIController extends EventEmitter {
    constructor(audioCore, presetManager, backgroundManager) {
        super();
        this.audioCore = audioCore;
        this.presetManager = presetManager;
        this.backgroundManager = backgroundManager;
        // (Future) Add UI state, DOM refs, etc.
    }

    initialize() {
        // (Future) Set up UI event listeners, bind controls, etc.
    }

    show() {
        // (Future) Show UI controls
    }

    hide() {
        // (Future) Hide UI controls (for auto-hide)
    }

    onUserInteraction(callback) {
        this.on('ui:user:interaction', callback);
    }
}

export default UIController;
