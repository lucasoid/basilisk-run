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
const LEVELS = 8;

let energyLevel = LEVELS;

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
        bars[i] = game.add.image(x, y, `energy${Math.ceil(i / 2)}`);
        emptyBar.setScrollFactor(0);
        bars[i].setScrollFactor(0);
    }
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

export const getMaxEnergyLevel = () => {
    return LEVELS;
};
