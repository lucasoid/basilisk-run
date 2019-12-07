import {
    getEnergyLevel,
    setEnergyLevel,
    getMaxEnergyLevel,
} from './energyMeter';

const JESUS_MODE_LENGTH = 2000;

let timer = null;
let interval = null;

const startJesusMode = () => {
    interval = setInterval(() => {
        setEnergyLevel(Math.max(0, getEnergyLevel() - 1));
    }, JESUS_MODE_LENGTH / getMaxEnergyLevel());
    timer = setTimeout(() => {
        clearInterval(interval);
        setEnergyLevel(0);
    }, JESUS_MODE_LENGTH);
};

const resetJesusMode = () => {
    clearTimeout(timer);
    clearInterval(interval);
    timer = null;
    interval = null;
    setEnergyLevel(getMaxEnergyLevel());
};

export const create = (game, player, { ground, water }) => {
    game.physics.add.collider(
        player,
        ground,
        () => {
            if (getEnergyLevel() < getMaxEnergyLevel()) resetJesusMode();
        },
        null
    );
    game.physics.add.collider(
        player,
        water,
        () => {
            if (player.body.velocity.x === 0 && getEnergyLevel() > 0) {
                setEnergyLevel(0);
            } else if (timer === null) startJesusMode();
        },
        () => getEnergyLevel() > 0
    );
};
