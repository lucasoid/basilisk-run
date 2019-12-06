import Phaser from 'phaser';
import constants from './constants';
import * as player from './player';
import * as level1 from './levels/level1';
import * as worldPhysics from './worldPhysics';

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
                level1.preload(this);
                player.preload(this);
            },
            create: function() {
                const { ground, water } = level1.create(this);
                const _player = player.create(this);
                worldPhysics.create(this, _player, { ground, water });
                this.cameras.main.startFollow(_player);
            },
            update: function() {
                player.update(this);
            },
        },
    });
}
