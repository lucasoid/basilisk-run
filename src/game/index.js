import Phaser from 'phaser';
import constants from './constants';
import sky from './assets/sky-day.png';
import ground from './assets/ground.png';
import * as basilisk from './basilisk';

let player;

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
                this.load.image('sky', sky);
                this.load.image('ground', ground);
                basilisk.loadSpritesheet(this);
            },
            create: function() {
                this.add.image(
                    constants.scene.WIDTH / 2,
                    constants.scene.HEIGHT / 2,
                    'sky'
                );

                const ground = this.physics.add.staticGroup();
                ground.create(
                    constants.scene.WIDTH / 2,
                    constants.scene.HEIGHT - constants.scene.GROUND_HEIGHT / 2,
                    'ground'
                );

                player = this.physics.add.sprite(
                    constants.scene.WIDTH / 2,
                    constants.scene.HEIGHT / 2,
                    basilisk.KEY
                );
                player.setBounce(0.2);
                player.setCollideWorldBounds(true);

                this.physics.add.collider(player, ground);
                basilisk.registerAnimations(this);
            },
            update: function() {
                basilisk.listenForUpdates(this, player);
            },
        },
    });
}
