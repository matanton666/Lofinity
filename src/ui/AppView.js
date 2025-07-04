import audioConfig from '../data/audioConfig.js';

class AppView {
    constructor({ app, audioCore, backgroundManager, volumeManager }) {
        this.app = app;
        this.audioCore = audioCore;
        this.backgroundManager = backgroundManager;
        this.volumeManager = volumeManager;
        this.root = document.getElementById('app');
        this.ambientVolumes = {};
        this.render();
    }

    render() {
        // Ambient sounds as a table
        const ambientRows = Object.entries(audioConfig.ambient).map(([type, tracks]) =>
            tracks.map(track => {
                const soundId = track;
                const label = track.split('/').pop().replace('.mp3', '').replace(/[-_]/g, ' ');
                return `<tr data-sound="${soundId}">
                    <td class="ambient-label">${label}</td>
                    <td><button class="ambient-toggle" data-sound="${soundId}">⏯</button></td>
                    <td><input class="ambient-volume" data-sound="${soundId}" type="range" min="0" max="1" step="0.01" value="1" /></td>
                </tr>`;
            }).join('')
        ).join('');

        this.root.innerHTML = `
            <div class="background-viewer"></div>
            <div class="ambient-panel">
                <h2>Ambient Sounds</h2>
                <table class="ambient-table">
                    <thead>
                        <tr><th>Sound</th><th>Play</th><th>Volume</th></tr>
                    </thead>
                    <tbody>
                        ${ambientRows}
                    </tbody>
                </table>
            </div>
            <div class="bottom-bar">
                <div class="music-controls">
                    <label>Music Category:
                        <select id="music-category">
                            ${Object.keys(audioConfig.music).map(cat => `<option value="${cat}">${cat}</option>`).join('')}
                        </select>
                    </label>
                    <button id="music-playpause" title="Play/Pause"><span id="music-playpause-icon">▶</span></button>
                    <input id="music-volume" type="range" min="0" max="1" step="0.01" value="1" />
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
        `;
        this.bindEvents();
        this.updateBackground();
    }

    bindEvents() {
        // Music controls
        const musicCategory = this.root.querySelector('#music-category');
        const musicPlayPause = this.root.querySelector('#music-playpause');
        const musicPlayPauseIcon = this.root.querySelector('#music-playpause-icon');
        const musicVolume = this.root.querySelector('#music-volume');
        let isPlaying = false;
        let currentCategory = musicCategory.value;

        const updatePlayPauseIcon = (playing) => {
            musicPlayPauseIcon.textContent = playing ? '⏸' : '▶';
        };

        // Play/pause toggle
        musicPlayPause.addEventListener('click', () => {
            if (isPlaying) {
                this.audioCore.musicPlayer.pause();
            } else {
                this.audioCore.musicPlayer.playCategory(musicCategory.value);
            }
        });

        // Category change: always pause and start new music
        musicCategory.addEventListener('change', () => {
            if (isPlaying) {
                musicPlayPause.click();
                updatePlayPauseIcon(isPlaying)
            }
        });

        musicVolume.addEventListener('input', e => this.audioCore.musicPlayer.setVolume(parseFloat(e.target.value)));

        // Listen for state changes to update icon
        if (this.audioCore.musicPlayer) {
            this.audioCore.musicPlayer.onStateChange(state => {
                isPlaying = (state === 'playing' || state === 'auto-next');
                updatePlayPauseIcon(isPlaying);
            });
        }

        // Ambient table controls
        this.root.querySelectorAll('.ambient-toggle').forEach(btn => {
            btn.addEventListener('click', e => {
                const soundId = e.target.getAttribute('data-sound');
                this.audioCore.toggleAmbientSound(soundId, soundId);
            });
        });
        this.root.querySelectorAll('.ambient-volume').forEach(slider => {
            slider.addEventListener('input', e => {
                const soundId = e.target.getAttribute('data-sound');
                const value = parseFloat(e.target.value);
                this.audioCore.ambientManager.setVolume(soundId, value);
                this.ambientVolumes[soundId] = value;
            });
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
