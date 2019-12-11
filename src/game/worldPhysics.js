import {
    getEnergyLevel,
    setEnergyLevel,
    getMaxEnergyLevel,
} from './energyMeter';
import { setSpeedMultiplier } from './player';

const JESUS_MODE_LENGTH = 2000;

let timer = null;
let interval = null;

const expendEnergy = () => {
    setEnergyLevel(Math.max(0, getEnergyLevel() - 1));
};

const submerge = () => {
    setEnergyLevel(0);
    setSpeedMultiplier(0.5);
};

const emerge = () => {
    setEnergyLevel(getMaxEnergyLevel());
    setSpeedMultiplier(1);
};

const startJesusMode = () => {
    interval = setInterval(() => {
        expendEnergy();
    }, JESUS_MODE_LENGTH / getMaxEnergyLevel());
    timer = setTimeout(() => {
        clearInterval(interval);
        submerge();
    }, JESUS_MODE_LENGTH);
};

const resetJesusMode = () => {
    clearTimeout(timer);
    timer = null;
    clearInterval(interval);
    interval = null;
    emerge();
};

export const create = (game, player, { ground, water, shoreline }) => {
    game.physics.add.collider(
        player,
        ground,
        () => {
            if (getEnergyLevel() < getMaxEnergyLevel()) {
                resetJesusMode();
            }
        },
        null
    );
    game.physics.add.collider(
        player,
        water,
        () => {
            if (player.body.velocity.x === 0 && getEnergyLevel() > 0) {
                submerge();
            } else if (timer === null) startJesusMode();
        },
        () => getEnergyLevel() > 0
    );

    game.physics.add.collider(player, shoreline);
};
