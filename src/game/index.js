import Phaser from 'phaser';
import constants from './constants';
import * as player from './player';
import * as levels from './levels';
import * as energyMeter from './energyMeter';

export function mountGame(el) {
    return new Phaser.Game({
        parent: el,
        type: Phaser.AUTO,
        width: constants.scene.WIDTH,
        height: constants.scene.HEIGHT,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 500 },
            },
        },
        scene: {
            preload: function() {
                levels.preload(this);
                energyMeter.preload(this);
                player.preload(this);
            },
            create: function() {
                levels.create(this);
                energyMeter.create(this);
                player.create(this);
            },
            update: function() {
                player.update(this);
            },
        },
    });
}
