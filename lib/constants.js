/**
 * Application-wide constants.
 * Centralizing these values makes the application easier to maintain and configure.
 */

export const ANIMATION = {
    // Minimum duration for the loading state to ensure animations play fully
    MIN_LOADING_DURATION: 3000, 
    TRANSITION_DURATION: 0.5,
    TRANSITION_DELAY: 0.2
};

export const IMAGES = {
    PENGUIN: {
        DEFAULT: '/penguin-default.png',
        THINKING: '/penguin-thinking.png',
        ERROR: '/penguin-error.png'
    },
    WELCOME: '/welcome-screen.png' // If used
};

export const COLORS = {
    TURQUOISE: '#06b6d4', // Cyan 500
    VIOLET: '#8b5cf6',   // Violet 500
    BG_TURQUOISE_CLASS: 'bg-cyan-500' 
};

export const MAP_SETTINGS = {
    DEFAULT_CENTER: [20, 0],
    DEFAULT_ZOOM: 2,
    FLIGHT_ZOOM: 4,
    PADDING: {
        TOP_LEFT: [450, 50],
        BOTTOM_RIGHT: [50, 50]
    }
};
