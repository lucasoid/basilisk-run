import energy0 from './assets/energy-0.png';
import energy1 from './assets/energy-1.png';
import energy2 from './assets/energy-2.png';
import energy3 from './assets/energy-3.png';
import energy4 from './assets/energy-4.png';

const X_OFFSET = 30;
const Y_OFFSET = 30;
const BAR_WIDTH = 15;
const BAR_HEIGHT = 30;
const GUTTER = 3;
const LEVELS = 24;
const DEFAULT_LEVEL = 8;

let energyLevel = DEFAULT_LEVEL;

const getPosition = i => {
    return {
        x: X_OFFSET + BAR_WIDTH / 2 + BAR_WIDTH * i + GUTTER * i,
        y: Y_OFFSET + BAR_HEIGHT / 2,
    };
};

let bars = {
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
    6: null,
    7: null,
    8: null,
    9: null,
    10: null,
    11: null,
    12: null,
    13: null,
    14: null,
    15: null,
    16: null,
    17: null,
    18: null,
    19: null,
    20: null,
    21: null,
    22: null,
    23: null,
    24: null,
};

export const preload = game => {
    game.load.image('energy0', energy0);
    game.load.image('energy1', energy1);
    game.load.image('energy2', energy2);
    game.load.image('energy3', energy3);
    game.load.image('energy4', energy4);
};

export const create = game => {
    for (let i = 1; i <= LEVELS; i++) {
        const { x, y } = getPosition(i);
        let emptyBar = game.add.image(x, y, 'energy0');
        bars[i] = game.add.image(
            x,
            y,
            `energy${Math.min(4, Math.ceil(i / 3))}`
        );
        emptyBar.setScrollFactor(0);
        bars[i].setScrollFactor(0);
    }
    setEnergyLevel(DEFAULT_LEVEL);
};

const updateMeter = energyLevel => {
    for (let i = 1; i <= LEVELS; i++) {
        if (i <= energyLevel) {
            bars[i].visible = true;
        } else {
            bars[i].visible = false;
        }
    }
};

export const setEnergyLevel = level => {
    if (level < 0) return;
    if (level > getMaxEnergyLevel()) return;
    energyLevel = level;
    updateMeter(level);
};

export const getEnergyLevel = () => {
    return energyLevel;
};

export const getDefaultEnergyLevel = () => {
    return DEFAULT_LEVEL;
};

export const getMaxEnergyLevel = () => {
    return LEVELS;
};
