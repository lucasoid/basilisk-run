export const types = {
    SET_LEVEL: 'SET_LEVEL',
    PAUSE: 'PAUSE',
    RESUME: 'RESUME',
    MUTE: 'MUTE',
    UNMUTE: 'UNMUTE',
    OPEN_MENU: 'OPEN_MENU',
    CLOSE_MENU: 'CLOSE_MENU',
};

const _state = {
    level: 'Level1',
    muted: true,
    paused: false,
    isMenuOpen: false,
};

const reducer = (action, state = _state) => {
    switch (action.type) {
        case types.SET_LEVEL:
            return { ...state, level: action.level };
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
