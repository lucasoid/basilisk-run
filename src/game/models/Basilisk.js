import basiliskSprites from '../assets/basilisk.png';
import footSplash from '../assets/sfx/foot_splash.wav';
import { dispatch, types, getState } from '../state';
import constants from '../constants';

const SPEED = 400;

export class Basilisk {
    static handle = 'basilisk';
    static animations = {
        runLeft: 'basilisk/runLeft',
        runRight: 'basilisk/runRight',
        restLeft: 'basilisk/restLeft',
        restRight: 'basilisk/restRight',
        jumpLeft: 'basilisk/jumpLeft',
        jumpRight: 'basilisk/jumpRight',
        swimLeft: 'basilisk/swimLeft',
        swimRight: 'basilisk/swimRight',
    };
    static length = 320;
    static collideLength = 200;
    static height = 120;
    static defaultSpeed = 1;
    static maxSpeed = 3;
    static jesusModeIntervalLength = 250;
    static JESUS_MODE_STATUSES = {
        ACTIVE: 'active',
        INACTIVE: 'inactive',
        SUBMERGED: 'submerged',
    };
    static DIRECTION = {
        LEFT: 'left',
        RIGHT: 'right',
    };
    scene = null;
    sprite = null;
    startX = 0;
    startY = 0;
    speed = Basilisk.defaultSpeed;
    jesusModeInterval = null;
    jesusModeStatus = Basilisk.JESUS_MODE_STATUSES.INACTIVE;
    direction = Basilisk.DIRECTION.LEFT;
    sfx = {
        footSplash: null,
    };

    constructor(scene) {
        this.scene = scene;
    }

    preload = () => {
        if (!this.scene.textures.exists(Basilisk.handle)) {
            this.scene.load.spritesheet(Basilisk.handle, basiliskSprites, {
                frameWidth: Basilisk.length,
                frameHeight: Basilisk.height,
            });
        }
        this.scene.load.audio('foot_splash', footSplash);
    };

    create = () => {
        this.sprite = this.scene.physics.add.sprite(
            this.startX,
            this.startY,
            Basilisk.handle
        );
        this.sprite.body.setSize(
            Basilisk.collideLength,
            Basilisk.height,
            false
        );
        this.setDirection(true);
        this.sprite.setBounce(0.1);
        this.sprite.setCollideWorldBounds(true);
        this.createAnimations();
        this.sprite.anims.play(Basilisk.animations.restRight, true);
        this.scene.cameras.main.startFollow(this.sprite);
        this.sfx.footSplash = this.scene.sound.add('foot_splash', {
            rate: 1.1,
            loop: true,
        });
    };

    update = () => {
        const cursors = this.scene.input.keyboard.createCursorKeys();

        if (this.jesusModeStatus === Basilisk.JESUS_MODE_STATUSES.SUBMERGED) {
            if (cursors.left.isDown) {
                this.swimLeft();
            } else if (cursors.right.isDown) {
                this.swimRight();
            } else if (this.sprite.body.blocked.down) {
                this.float();
            }
            if (cursors.up.isDown && this.sprite.body.blocked.down) {
                this.jump();
            }
        } else {
            if (cursors.left.isDown) {
                this.runLeft();
            } else if (cursors.right.isDown) {
                this.runRight();
            } else if (this.sprite.body.blocked.down) {
                this.rest();
            }
            if (cursors.up.isDown && this.sprite.body.blocked.down) {
                this.jump();
            }
        }
        if (this.jesusModeStatus === Basilisk.JESUS_MODE_STATUSES.ACTIVE) {
            if (!this.sfx.footSplash.isPlaying && this.sprite.body.blocked.down)
                this.sfx.footSplash.play();
            if (this.sfx.footSplash.isPlaying && !this.sprite.body.blocked.down)
                this.sfx.footSplash.stop();
        } else {
            if (this.sfx.footSplash.isPlaying) this.sfx.footSplash.stop();
        }
    };

    createAnimations = () => {
        this.scene.anims.create({
            key: Basilisk.animations.runLeft,
            // frames are 0-index
            frames: this.scene.anims.generateFrameNumbers(Basilisk.handle, {
                start: 15,
                end: 8,
            }),
            frameRate: 16,
            repeat: -1,
        });
        this.scene.anims.create({
            key: Basilisk.animations.runRight,
            frames: this.scene.anims.generateFrameNumbers(Basilisk.handle, {
                start: 0,
                end: 7,
            }),
            frameRate: 16,
            repeat: -1,
        });
        this.scene.anims.create({
            key: Basilisk.animations.restLeft,
            frames: this.scene.anims.generateFrameNumbers(Basilisk.handle, {
                start: 21,
                end: 19,
            }),
            frameRate: 10,
            yoyo: true,
            repeat: -1,
            delay: 1500,
            repeatDelay: 1500,
        });
        this.scene.anims.create({
            key: Basilisk.animations.restRight,
            frames: this.scene.anims.generateFrameNumbers(Basilisk.handle, {
                start: 16,
                end: 18,
            }),
            frameRate: 10,
            yoyo: true,
            repeat: -1,
            delay: 1500,
            repeatDelay: 1500,
        });
        this.scene.anims.create({
            key: Basilisk.animations.jumpLeft,
            frames: this.scene.anims.generateFrameNumbers(Basilisk.handle, {
                start: 27,
                end: 25,
            }),
            frameRate: 16,
        });
        this.scene.anims.create({
            key: Basilisk.animations.jumpRight,
            frames: this.scene.anims.generateFrameNumbers(Basilisk.handle, {
                start: 22,
                end: 24,
            }),
            frameRate: 16,
        });
        this.scene.anims.create({
            key: Basilisk.animations.swimLeft,
            frames: this.scene.anims.generateFrameNumbers(Basilisk.handle, {
                start: 35,
                end: 32,
            }),
            frameRate: 10,
            repeat: -1,
            yoyo: true,
            repeatDelay: 200,
        });
        this.scene.anims.create({
            key: Basilisk.animations.swimRight,
            frames: this.scene.anims.generateFrameNumbers(Basilisk.handle, {
                start: 28,
                end: 31,
            }),
            frameRate: 10,
            repeat: -1,
            yoyo: true,
            repeatDelay: 200,
        });
    };

    setSpeed = speed => {
        const prev = this.speed;
        const next = Math.min(Basilisk.maxSpeed, Math.max(speed, 0));
        this.speed = next;
        // this.speedCallbacks.forEach(cb => cb(next, prev));
    };

    submerge() {
        clearInterval(this.jesusModeInterval);
        this.jesusModeInterval = null;
        this.jesusModeStatus = Basilisk.JESUS_MODE_STATUSES.SUBMERGED;
        dispatch({ type: types.SET_ENERGY_LEVEL, energyLevel: 0 });
        this.setSpeed(0.5);
    }

    emerge() {
        clearInterval(this.jesusModeInterval);
        this.jesusModeInterval = null;
        this.jesusModeStatus = Basilisk.JESUS_MODE_STATUSES.INACTIVE;
        const { energyLevel } = getState();
        if (energyLevel < constants.player.defaultEnergy)
            dispatch({ type: types.RESET_ENERGY_LEVEL });
        if (this.speed <= Basilisk.defaultSpeed)
            this.setSpeed(Basilisk.defaultSpeed);
    }

    startJesusMode = () => {
        this.jesusModeStatus = Basilisk.JESUS_MODE_STATUSES.ACTIVE;
        this.jesusModeInterval = setInterval(() => {
            const { paused, energyLevel } = getState();
            if (paused) return;
            if (energyLevel === 0) {
                this.submerge();
            } else {
                dispatch({
                    type: types.SET_ENERGY_LEVEL,
                    energyLevel: energyLevel - 1,
                });
            }
        }, Basilisk.jesusModeIntervalLength);
    };

    runLeft = () => {
        this.sprite.setVelocityX(-1 * SPEED * this.speed);
        if (this.sprite.body.blocked.down) {
            this.sprite.anims.play(Basilisk.animations.runLeft, true);
        } else {
            this.sprite.setFrame(25);
        }
        this.setDirection(false);
    };

    runRight = () => {
        this.sprite.setVelocityX(1 * SPEED * this.speed);
        if (this.sprite.body.blocked.down) {
            this.sprite.anims.play(Basilisk.animations.runRight, true);
        } else {
            this.sprite.setFrame(24);
        }
        this.setDirection(true);
    };

    swimLeft = () => {
        this.sprite.setVelocityX(-1 * SPEED * this.speed);
        if (this.sprite.body.blocked.down) {
            this.sprite.anims.play(Basilisk.animations.swimLeft, true);
        }
        this.setDirection(false);
    };

    swimRight = () => {
        this.sprite.setVelocityX(1 * SPEED * this.speed);
        if (this.sprite.body.blocked.down) {
            this.sprite.anims.play(Basilisk.animations.swimRight, true);
        }
        this.setDirection(true);
    };

    jump = () => {
        this.sprite.setVelocityY(-1 * Math.max(300, SPEED * this.speed));
        if (this.direction === Basilisk.DIRECTION.LEFT) {
            this.sprite.anims.play(Basilisk.animations.jumpLeft, true);
        } else {
            this.sprite.anims.play(Basilisk.animations.jumpRight, true);
        }
    };

    /**
     * @param {Boolean} isRight - true if the lizard should face right
     */
    setDirection = isRight => {
        if ((this.direction === Basilisk.DIRECTION.RIGHT) === isRight) return;
        this.direction = isRight
            ? Basilisk.DIRECTION.RIGHT
            : Basilisk.DIRECTION.LEFT;
        this.sprite.body.setOffset(
            isRight ? Basilisk.length - Basilisk.collideLength : 0,
            0
        );
    };

    rest = () => {
        if (this.sprite.body.velocity.x < 0) {
            this.sprite.anims.play(Basilisk.animations.restLeft, true);
            this.setDirection(false);
        } else if (this.sprite.body.velocity.x > 0) {
            this.sprite.anims.play(Basilisk.animations.restRight, true);
            this.setDirection(true);
        }
        if (this.sprite.body.velocity.x === 0) {
            this.sprite.anims.play(
                this.direction === Basilisk.DIRECTION.LEFT
                    ? Basilisk.animations.restLeft
                    : Basilisk.animations.restRight,
                true
            );
        }
        // stop moving
        this.sprite.setVelocityX(0);
    };

    float = () => {
        this.rest();
        if (this.direction === Basilisk.DIRECTION.LEFT) {
            this.sprite.setFrame(32);
        } else {
            this.sprite.setFrame(31);
        }
    };

    onUpdateEnergy = () => {
        // no op
    };
}
