import {
    getEnergyLevel,
    setEnergyLevel,
    getMaxEnergyLevel,
    getDefaultEnergyLevel,
} from './energyMeter';
import basiliskSprites from './assets/basilisk-sprites.png';
import * as levels from './levels';

export const KEY = 'basilisk';

export let player;

let SPEED = 400;
let speedMultiplier = 1;

export const animations = {
    LEFT: 'left',
    RIGHT: 'right',
};

const JESUS_MODE_INT_LENGTH = 250; // length in ms to expend one unit of energy

let interval = null;

const expendEnergy = () => {
    setEnergyLevel(Math.max(0, getEnergyLevel() - 1));
};

const submerge = () => {
    setEnergyLevel(0);
    setSpeedMultiplier(0.5);
};

const emerge = () => {
    if (getEnergyLevel() < getDefaultEnergyLevel()) {
        setEnergyLevel(getDefaultEnergyLevel());
    }
    setSpeedMultiplier(1);
};

const startJesusMode = () => {
    interval = setInterval(() => {
        expendEnergy();
        if (getEnergyLevel() <= 0) submerge();
    }, JESUS_MODE_INT_LENGTH);
};

const resetJesusMode = () => {
    clearInterval(interval);
    interval = null;
    emerge();
};

export const preload = game => {
    game.load.spritesheet(KEY, basiliskSprites, {
        frameWidth: 250,
        frameHeight: 137.33,
    });
};

export const create = game => {
    player = game.physics.add.sprite(250, 250, KEY);
    player.setBounce(0.1);
    player.setCollideWorldBounds(true);
    game.anims.create({
        key: animations.LEFT,
        // frames are 0-index
        frames: game.anims.generateFrameNumbers(KEY, { start: 11, end: 8 }),
        frameRate: 10,
        repeat: -1,
    });

    game.anims.create({
        key: animations.RIGHT,
        frames: game.anims.generateFrameNumbers(KEY, { start: 4, end: 7 }),
        frameRate: 10,
        repeat: -1,
    });

    // sink or swim logic:
    game.physics.add.collider(
        player,
        levels.getGroundLayer(),
        () => {
            if (getEnergyLevel() < getDefaultEnergyLevel()) {
                resetJesusMode();
            }
        },
        null
    );
    game.physics.add.collider(
        player,
        levels.getWaterLayer(),
        () => {
            if (player.body.velocity.x === 0 && getEnergyLevel() > 0) {
                submerge();
            } else if (interval === null) startJesusMode();
        },
        () => getEnergyLevel() > 0
    );
    game.physics.add.collider(player, levels.getShoreLayer());

    game.cameras.main.startFollow(player);
};

export const update = game => {
    const cursors = game.input.keyboard.createCursorKeys();

    if (cursors.left.isDown) {
        player.setVelocityX(-1 * SPEED * speedMultiplier);
        player.anims.play(animations.LEFT, true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(1 * SPEED * speedMultiplier);
        player.anims.play(animations.RIGHT, true);
    } else if (player.body.blocked.down) {
        // stop all animations
        player.anims.stop(null);
        // set the resting frame to either left or right
        if (player.body.velocity.x < 0) {
            player.setFrame(1);
        } else if (player.body.velocity.x > 0) {
            player.setFrame(0);
        }
        // stop moving
        player.setVelocityX(0);
    }

    if (cursors.up.isDown && player.body.blocked.down) {
        player.setVelocityY(-1 * Math.max(300, SPEED * speedMultiplier));
    }
};

export const getSpeedMultiplier = () => {
    return speedMultiplier;
};

export const setSpeedMultiplier = multiplier => {
    speedMultiplier = multiplier;
};
