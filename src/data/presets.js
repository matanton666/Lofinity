// Example preset data for Lofinity
const presets = [
    {
        id: 'rainy-study',
        name: 'Rainy Study Session',
        musicCategory: 'chill',
        musicTrack: 'assets/music/chill/chill-01.mp3',
        ambientSounds: [
            { id: 'rain-light', url: 'assets/sounds/nature/rain-light.mp3', volume: 0.7 }
        ],
        background: 'cozy-01.jpg'
    },
    {
        id: 'cozy-fireplace',
        name: 'Cozy Fireplace',
        musicCategory: 'jazz',
        musicTrack: 'assets/music/jazz/jazz-01.mp3',
        ambientSounds: [
            { id: 'fireplace', url: 'assets/sounds/indoor/fireplace.mp3', volume: 0.6 }
        ],
        background: 'cozy-02.jpg'
    },
    {
        id: 'ocean-breeze',
        name: 'Ocean Breeze',
        musicCategory: 'ambient',
        musicTrack: 'assets/music/ambient/ambient-01.mp3',
        ambientSounds: [
            { id: 'ocean', url: 'assets/sounds/water/ocean-waves.mp3', volume: 0.8 }
        ],
        background: 'nature-01.jpg'
    },
    // ...add more presets as needed
];

export default presets;
