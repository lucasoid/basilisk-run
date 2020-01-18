import beetleSprites from '../assets/beetle.png';
import constants from '../constants';

const SPEED = 100;
export class Beetle {
    static handle = 'beetle';
    static animations = {
        runLeft: 'beetle/runLeft',
        runRight: 'beetle/runRight',
        blinkLeft: 'beetle/blinkLeft',
        blinkRight: 'beetle/blinkRight',
    };
    scene;
    player;
    sprite;
    startX = 0;
    startY = 0;

    constructor(scene, player) {
        this.scene = scene;
        this.player = player;
    }

    static preload = scene => {
        if (!scene.textures.exists(Beetle.handle)) {
            scene.load.spritesheet(Beetle.handle, beetleSprites, {
                frameWidth: 48,
                frameHeight: 24,
            });
        }
    };

    create = () => {
        this.sprite = this.scene.physics.add.sprite(
            this.startX,
            this.startY,
            Beetle.handle
        );
        this.sprite.setCollideWorldBounds(true);
        this.createAnimations();
        this.sprite.setBounce(0.1);
    };

    createAnimations = () => {
        this.scene.anims.create({
            key: Beetle.animations.runLeft,
            // frames are 0-index
            frames: this.scene.anims.generateFrameNumbers(Beetle.handle, {
                start: 11,
                end: 6,
            }),
            frameRate: 10,
            yoyo: true,
            repeat: -1,
        });
        this.scene.anims.create({
            key: Beetle.animations.runRight,
            frames: this.scene.anims.generateFrameNumbers(Beetle.handle, {
                start: 0,
                end: 5,
            }),
            frameRate: 10,
            yoyo: true,
            repeat: -1,
        });
        this.scene.anims.create({
            key: Beetle.animations.blinkLeft,
            frames: this.scene.anims.generateFrameNumbers(Beetle.handle, {
                start: 17,
                end: 15,
            }),
            frameRate: 10,
            yoyo: true,
            repeat: -1,
            delay: 1500,
            repeatDelay: 1500,
        });
        this.scene.anims.create({
            key: Beetle.animations.blinkRight,
            frames: this.scene.anims.generateFrameNumbers(Beetle.handle, {
                start: 12,
                end: 14,
            }),
            frameRate: 10,
            yoyo: true,
            repeat: -1,
            delay: 1500,
            repeatDelay: 1500,
        });
    };

    runLeft = () => {
        this.sprite.setVelocityX(-1 * SPEED);
        if (!this.sprite.body.blocked.left) {
            this.sprite.anims.play(Beetle.animations.runLeft, true);
        } else {
            this.sprite.anims.stop();
        }
    };

    runRight = () => {
        this.sprite.setVelocityX(1 * SPEED);
        if (!this.sprite.body.blocked.right) {
            this.sprite.anims.play(Beetle.animations.runRight, true);
        } else {
            this.sprite.anims.stop();
        }
    };

    rest = () => {
        // set the resting frame to either left or right
        if (this.sprite.body.velocity.x < 0) {
            this.sprite.anims.play(Beetle.animations.blinkLeft, true);
        } else if (this.sprite.body.velocity.x > 0) {
            this.sprite.anims.play(Beetle.animations.blinkRight, true);
        }
        this.sprite.setVelocity(0);
    };

    update = () => {
        if (!this.sprite.body) return;
        // the lizard approacheth
        const safeDistance = (constants.screen.WIDTH - 100) / 2;
        if (
            Math.abs(this.player.sprite.x - this.sprite.x) < safeDistance &&
            Math.abs(this.player.sprite.y - this.sprite.y) < safeDistance
        ) {
            if (this.player.sprite.x > this.sprite.x) {
                this.runLeft();
            } else {
                this.runRight();
            }
        }
        // hitting a wall
        else if (this.sprite.body.blocked.left) {
            this.runRight();
        } else if (this.sprite.body.blocked.right) {
            this.runLeft();
        } else {
            if (this.sprite.body.velocity.x !== 0) {
                this.rest();
            }
        }
    };
}
