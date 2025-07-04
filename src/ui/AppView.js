import audioConfig from '../data/audioConfig.js';

class AppView {
    constructor({ app, audioCore, backgroundManager, volumeManager }) {
        this.app = app;
        this.audioCore = audioCore;
        this.backgroundManager = backgroundManager;
        this.volumeManager = volumeManager;
        this.root = document.getElementById('app');
        this.render();
    }

    render() {
        this.root.innerHTML = `
            <div class="lofinity-ui">
                <div class="background-viewer"></div>
                <div class="controls">
                    <div class="music-controls">
                        <label>Music Category:
                            <select id="music-category">
                                ${Object.keys(audioConfig.music).map(cat => `<option value="${cat}">${cat}</option>`).join('')}
                            </select>
                        </label>
                        <label>Track:
                            <select id="music-track"></select>
                        </label>
                        <button id="music-play">Play</button>
                        <button id="music-pause">Pause</button>
                        <input id="music-volume" type="range" min="0" max="1" step="0.01" value="1" />
                    </div>
                    <div class="ambient-controls">
                        <label>Ambient Sound:
                            <select id="ambient-type">
                                ${Object.keys(audioConfig.ambient).map(type => `<option value="${type}">${type}</option>`).join('')}
                            </select>
                        </label>
                        <label>Sound:
                            <select id="ambient-track"></select>
                        </label>
                        <button id="ambient-toggle">Toggle</button>
                        <input id="ambient-volume" type="range" min="0" max="1" step="0.01" value="1" />
                    </div>
                    <div class="background-controls">
                        <button id="background-next">Next Background</button>
                    </div>
                    <div class="master-volume">
                        <label>Master Volume:
                            <input id="master-volume" type="range" min="0" max="1" step="0.01" value="1" />
                        </label>
                    </div>
                </div>
            </div>
        `;
        this.bindEvents();
        this.populateMusicTracks();
        this.populateAmbientTracks();
        this.updateBackground();
    }

    bindEvents() {
        // Music controls
        const musicCategory = this.root.querySelector('#music-category');
        const musicTrack = this.root.querySelector('#music-track');
        const musicPlay = this.root.querySelector('#music-play');
        const musicPause = this.root.querySelector('#music-pause');
        const musicVolume = this.root.querySelector('#music-volume');
        musicCategory.addEventListener('change', () => this.populateMusicTracks());
        musicPlay.addEventListener('click', () => {
            const trackUrl = musicTrack.value;
            this.audioCore.playMusic(musicCategory.value, trackUrl);
        });
        musicPause.addEventListener('click', () => this.audioCore.musicPlayer.pause());
        musicVolume.addEventListener('input', e => this.audioCore.musicPlayer.setVolume(parseFloat(e.target.value)));

        // Ambient controls
        const ambientType = this.root.querySelector('#ambient-type');
        const ambientTrack = this.root.querySelector('#ambient-track');
        const ambientToggle = this.root.querySelector('#ambient-toggle');
        const ambientVolume = this.root.querySelector('#ambient-volume');
        ambientType.addEventListener('change', () => this.populateAmbientTracks());
        ambientToggle.addEventListener('click', () => {
            const soundId = ambientTrack.value;
            const sourceUrl = ambientTrack.value;
            this.audioCore.toggleAmbientSound(soundId, sourceUrl);
        });
        ambientVolume.addEventListener('input', e => {
            const soundId = ambientTrack.value;
            this.audioCore.ambientManager.setVolume(soundId, parseFloat(e.target.value));
        });

        // Background controls
        const backgroundNext = this.root.querySelector('#background-next');
        backgroundNext.addEventListener('click', () => {
            this.backgroundManager.nextBackground();
        });
        this.backgroundManager.on('background:change', () => this.updateBackground());

        // Master volume
        const masterVolume = this.root.querySelector('#master-volume');
        masterVolume.addEventListener('input', e => this.audioCore.setMasterVolume(parseFloat(e.target.value)));
    }

    populateMusicTracks() {
        const musicCategory = this.root.querySelector('#music-category');
        const musicTrack = this.root.querySelector('#music-track');
        const tracks = audioConfig.music[musicCategory.value] || [];
        musicTrack.innerHTML = tracks.map(url => `<option value="${url}">${url.split('/').pop()}</option>`).join('');
    }

    populateAmbientTracks() {
        const ambientType = this.root.querySelector('#ambient-type');
        const ambientTrack = this.root.querySelector('#ambient-track');
        const tracks = audioConfig.ambient[ambientType.value] || [];
        ambientTrack.innerHTML = tracks.map(url => `<option value="${url}">${url.split('/').pop()}</option>`).join('');
    }

    updateBackground() {
        const bg = this.backgroundManager.getCurrentBackground();
        const viewer = this.root.querySelector('.background-viewer');
        if (viewer) {
            viewer.style.backgroundImage = `url('${bg.url}')`;
            viewer.style.backgroundSize = 'cover';
            viewer.style.backgroundPosition = 'center';
            viewer.style.width = '100vw';
            viewer.style.height = '100vh';
            viewer.style.position = 'fixed';
            viewer.style.top = '0';
            viewer.style.left = '0';
            viewer.style.zIndex = '-1';
        }
    }
}

export default AppView;
