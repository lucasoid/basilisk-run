import { levels } from './levels/LevelManager';

export const types = {
    SET_LEVEL: 'SET_LEVEL',
    PAUSE: 'PAUSE',
    RESUME: 'RESUME',
    MUTE: 'MUTE',
    UNMUTE: 'UNMUTE',
    OPEN_MENU: 'OPEN_MENU',
    CLOSE_MENU: 'CLOSE_MENU',
    ZOOM_OUT: 'ZOOM_OUT',
    ZOOM_IN: 'ZOOM_IN',
};

const _state = {
    level: 'Level1',
    highestLevel: 'Level1',
    showTransition: false,
    muted: true,
    paused: false,
    isMenuOpen: false,
    zoom: 1,
};

const reducer = (action, state = _state) => {
    switch (action.type) {
        case types.SET_LEVEL:
            let levelIndex = levels.findIndex(l => l.key === action.level);
            let highestIndex = levels.findIndex(
                l => l.key === state.highestLevel
            );
            let newState = {
                ...state,
                level: action.level,
                showTransition: !!action.showTransition,
            };
            if (levelIndex > highestIndex) {
                newState.highestLevel = action.level;
            }
            return newState;
        case types.PAUSE:
            return { ...state, paused: true };
        case types.RESUME:
            return { ...state, paused: false };
        case types.MUTE:
            return { ...state, muted: true };
        case types.UNMUTE:
            return { ...state, muted: false };
        case types.OPEN_MENU:
            return { ...state, isMenuOpen: true };
        case types.CLOSE_MENU:
            return { ...state, isMenuOpen: false };
        case types.ZOOM_OUT:
            return { ...state, zoom: Math.max(0.5, state.zoom - 0.1) };
        case types.ZOOM_IN:
            return { ...state, zoom: Math.min(1, state.zoom + 0.1) };
        default:
            return state;
    }
};

let state = reducer({});
const subscribers = [];

export const getState = () => JSON.parse(JSON.stringify(state));

export const dispatch = action => {
    if (!action.type)
        throw new Error('type is required when dispatching actions');
    state = reducer(action, getState());
    subscribers.forEach(fn => fn(state));
};

export const subscribe = fn => {
    if (typeof fn !== 'function')
        throw new Error('subscriber is not a function');
    subscribers.push(fn);
    fn(state);
};

export const unsubscribe = fn => {
    let i = subscribers.findIndex(subscriber => subscriber === fn);
    if (i) subscribers.splice(i, 1);
    else throw new Error('unsubscribe was called on a non-subscriber');
};
