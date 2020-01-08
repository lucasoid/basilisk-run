import Phaser from 'phaser';
import constants from './constants';
import * as LevelManager from './levels/LevelManager';

export let game;
export function mountGame(el) {
    game = new Phaser.Game({
        parent: el,
        type: Phaser.AUTO,
        width: constants.screen.WIDTH,
        height: constants.screen.HEIGHT,
        physics: {
            default: 'arcade',
            arcade: {
                // debug: true,
                gravity: { y: 500 },
            },
        },
    });

    LevelManager.init();

    return game;
}
