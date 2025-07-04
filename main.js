import Application from './src/core/Application.js';
import AppView from './src/ui/AppView.js';
import audioConfig from './src/data/audioConfig.js';

function showLoadingOverlay() {
    let overlay = document.createElement('div');
    overlay.id = 'loading-overlay';
    overlay.innerHTML = `<div class="loading-spinner"></div><div class="loading-text">Loading sounds...</div>`;
    document.body.appendChild(overlay);
}

function hideLoadingOverlay() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.remove();
}

async function preloadAllAudioBuffers(audioContext, assetLoader) {
    const allUrls = [
        ...Object.values(audioConfig.music).flat(),
        ...Object.values(audioConfig.ambient).flat()
    ];
    const buffers = {};
    for (const url of allUrls) {
        const arrayBuffer = await assetLoader.load(url);
        buffers[url] = await audioContext.decodeAudioData(arrayBuffer);
    }
    return buffers;
}

const app = new Application();
showLoadingOverlay();
app.initialize().then(async () => {
    // Preload all music and ambient sounds
    const audioContext = app.audioCore.audioContext;
    const assetLoader = app.audioCore.assetLoader;
    const preloadedBuffers = await preloadAllAudioBuffers(audioContext, assetLoader);
    app.audioCore.musicPlayer.setPreloadedBuffers(preloadedBuffers);
    app.audioCore.ambientManager.setPreloadedBuffers(preloadedBuffers);
    hideLoadingOverlay();
    app.start();
    // Mount UI
    new AppView({
        app,
        audioCore: app.audioCore,
        backgroundManager: app.backgroundManager,
        volumeManager: app.audioCore.volumeManager
    });
});

// Add CSS for loading overlay and spinner
const style = document.createElement('style');
style.innerHTML = `
#loading-overlay {
  position: fixed;
  z-index: 9999;
  top: 0; left: 0; width: 100vw; height: 100vh;
  background: linear-gradient(135deg, #232526 0%, #414345 100%);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
}
.loading-spinner {
  border: 8px solid #7ec4cf;
  border-top: 8px solid #232526;
  border-radius: 50%;
  width: 70px; height: 70px;
  animation: spin 1.1s linear infinite;
  margin-bottom: 1.5rem;
}
@keyframes spin { 100% { transform: rotate(360deg); } }
.loading-text {
  color: #a6e3e9;
  font-size: 1.3rem;
  letter-spacing: 1px;
  text-align: center;
}`;
document.head.appendChild(style);
