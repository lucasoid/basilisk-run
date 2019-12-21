import basiliskSprites from '../assets/basilisk-sprites.png';

const SPEED = 400;

export class Basilisk {
    static handle = 'basilisk';
    static animations = {
        runLeft: 'basilisk/runLeft',
        runRight: 'basilisk/runRight',
    };
    static defaultEnergy = 8;
    static maxEnergy = 24;
    static defaultSpeed = 1;
    static maxSpeed = 3;
    static jesusModeIntervalLength = 250;
    static JESUS_MODE_STATUSES = {
        ACTIVE: 'active',
        INACTIVE: 'inactive',
        SUBMERGED: 'submerged',
    };
    scene = null;
    sprite = null;
    startX = 0;
    startY = 0;
    energy = Basilisk.defaultEnergy;
    speed = Basilisk.defaultSpeed;
    energyCallbacks = [];
    speedCallbacks = [];
    jesusModeInterval = null;
    jesusModeStatus = Basilisk.JESUS_MODE_STATUSES.INACTIVE;

    constructor(scene) {
        this.scene = scene;
    }

    preload = () => {
        if (!this.scene.textures.exists(Basilisk.handle)) {
            this.scene.load.spritesheet(Basilisk.handle, basiliskSprites, {
                frameWidth: 250,
                frameHeight: 137.33,
            });
        }
    };

    create = () => {
        this.sprite = this.scene.physics.add.sprite(
            this.startX,
            this.startY,
            Basilisk.handle
        );
        this.sprite.setBounce(0.1);
        this.sprite.setCollideWorldBounds(true);
        this.createAnimations();
        this.scene.cameras.main.startFollow(this.sprite);
    };

    update = () => {
        const cursors = this.scene.input.keyboard.createCursorKeys();
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
    };

    createAnimations = () => {
        this.scene.anims.create({
            key: Basilisk.animations.runLeft,
            // frames are 0-index
            frames: this.scene.anims.generateFrameNumbers(Basilisk.handle, {
                start: 11,
                end: 8,
            }),
            frameRate: 10,
            repeat: -1,
        });
        this.scene.anims.create({
            key: Basilisk.animations.runRight,
            frames: this.scene.anims.generateFrameNumbers(Basilisk.handle, {
                start: 4,
                end: 7,
            }),
            frameRate: 10,
            repeat: -1,
        });
    };

    onUpdateEnergy = cb => {
        if (typeof cb !== 'function')
            throw new Error('callback must be a function');
        this.energyCallbacks.push(cb);
    };

    onUpdateSpeed = cb => {
        if (typeof cb !== 'function')
            throw new Error('callback must be a function');
        this.speedCallbacks.push(cb);
    };

    changeEnergy = (delta = 0) => {
        this.setEnergy(this.energy + delta);
    };

    setEnergy = level => {
        const prev = this.energy;
        const next = Math.min(Basilisk.maxEnergy, Math.max(level, 0));
        this.energy = next;
        this.energyCallbacks.forEach(cb => cb(next, prev));
    };

    setSpeed = speed => {
        const prev = this.speed;
        const next = Math.min(Basilisk.maxSpeed, Math.max(speed, 0));
        this.speed = next;
        this.speedCallbacks.forEach(cb => cb(next, prev));
    };

    submerge() {
        clearInterval(this.jesusModeInterval);
        this.jesusModeInterval = null;
        this.jesusModeStatus = Basilisk.JESUS_MODE_STATUSES.SUBMERGED;
        this.setEnergy(0);
        this.setSpeed(0.5);
    }

    emerge() {
        clearInterval(this.jesusModeInterval);
        this.jesusModeInterval = null;
        this.jesusModeStatus = Basilisk.JESUS_MODE_STATUSES.INACTIVE;
        if (this.energy <= Basilisk.defaultEnergy)
            this.setEnergy(Basilisk.defaultEnergy);
        if (this.speed <= Basilisk.defaultSpeed)
            this.setSpeed(Basilisk.defaultSpeed);
    }

    startJesusMode = () => {
        this.jesusModeStatus = Basilisk.JESUS_MODE_STATUSES.ACTIVE;
        this.jesusModeInterval = setInterval(() => {
            if (this.energy === 0) {
                this.submerge();
            } else {
                this.setEnergy(Math.max(0, this.energy - 1));
            }
        }, Basilisk.jesusModeIntervalLength);
    };

    runLeft = () => {
        this.sprite.setVelocityX(-1 * SPEED * this.speed);
        this.sprite.anims.play(Basilisk.animations.runLeft, true);
    };

    runRight = () => {
        this.sprite.setVelocityX(1 * SPEED * this.speed);
        this.sprite.anims.play(Basilisk.animations.runRight, true);
    };

    jump = () => {
        this.sprite.setVelocityY(-1 * Math.max(300, SPEED * this.speed));
    };

    rest = () => {
        // stop all animations
        this.sprite.anims.stop(null);
        // set the resting frame to either left or right
        if (this.sprite.body.velocity.x < 0) {
            this.sprite.setFrame(1);
        } else if (this.sprite.body.velocity.x > 0) {
            this.sprite.setFrame(0);
        }
        // stop moving
        this.sprite.setVelocityX(0);
    };
}
