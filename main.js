import Application from './src/core/Application.js';
import AppView from './src/ui/AppView.js';

const app = new Application();
app.initialize().then(() => {
    app.start();
    // Mount UI
    new AppView({
        app,
        audioCore: app.audioCore,
        presetManager: app.presetManager,
        backgroundManager: app.backgroundManager,
        volumeManager: app.audioCore.volumeManager
    });
});
