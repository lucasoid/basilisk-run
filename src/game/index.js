import Phaser from 'phaser';
import constants from './constants';
import sky from './assets/sky.png';
import ground from './assets/ground.png';
import basilisk from './assets/basilisk.png';

let player;

export function mountGame(el) {
    return new Phaser.Game({
        parent: el,
        type: Phaser.AUTO,
        width: constants.WIDTH,
        height: constants.HEIGHT,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 300 },
            },
        },
        scene: {
            preload: function() {
                this.load.image('sky', sky);
                this.load.image('ground', ground);
                this.load.image('basilisk', basilisk);
            },
            create: function() {
                this.add.image(
                    constants.WIDTH / 2,
                    constants.HEIGHT / 2,
                    'sky'
                );

                const ground = this.physics.add.staticGroup();
                ground.create(
                    constants.WIDTH / 2,
                    constants.HEIGHT - constants.GROUND_HEIGHT / 2,
                    'ground'
                );

                player = this.physics.add.sprite(
                    constants.WIDTH / 2,
                    constants.HEIGHT / 2,
                    'basilisk'
                );
                player.setBounce(0.2);
                player.setCollideWorldBounds(true);

                this.physics.add.collider(player, ground);
            },
            update: function() {
                const cursors = this.input.keyboard.createCursorKeys();
                if (cursors.left.isDown) {
                    player.setVelocityX(-160);
                } else if (cursors.right.isDown) {
                    player.setVelocityX(160);
                } else {
                    player.setVelocityX(0);
                }
                if (cursors.up.isDown && player.body.touching.down) {
                    player.setVelocityY(-330);
                }
            },
        },
    });
}
