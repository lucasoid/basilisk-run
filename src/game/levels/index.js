import * as level1 from './level1';

export let currentLevel = 1;

const levels = {
    1: level1,
};

export const preload = game => {
    console.log(level1);
    levels[currentLevel].preload(game);
};

export const create = game => {
    levels[currentLevel].create(game);
};

export const getWaterLayer = () => {
    return levels[currentLevel].water;
};

export const getGroundLayer = () => {
    return levels[currentLevel].ground;
};

export const getShoreLayer = () => {
    return levels[currentLevel].shore;
};
