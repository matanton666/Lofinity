import EventEmitter from '../utils/EventEmitter.js';
import backgrounds from '../data/backgrounds.js';

class BackgroundManager extends EventEmitter {
    constructor() {
        super();
        this.backgrounds = backgrounds;
        this.currentIndex = Math.floor(Math.random() * this.backgrounds.length);
    }

    getCurrentBackground() {
        return this.backgrounds[this.currentIndex];
    }

    nextBackground() {
        this.currentIndex = (this.currentIndex + 1) % this.backgrounds.length;
        this.emit('background:change', this.getCurrentBackground());
    }

    setBackground(index) {
        if (index >= 0 && index < this.backgrounds.length) {
            this.currentIndex = index;
            this.emit('background:change', this.getCurrentBackground());
        }
    }

    getBackgrounds() {
        return this.backgrounds;
    }
}

export default BackgroundManager;
