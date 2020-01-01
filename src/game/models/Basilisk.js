import basiliskSprites from '../assets/basilisk.png';

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
    static DIRECTION = {
        LEFT: 'left',
        RIGHT: 'right',
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
    direction = Basilisk.DIRECTION.LEFT;

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
        this.sprite.body.setOffset(Basilisk.length - Basilisk.collideLength, 0);
        this.sprite.setBounce(0.1);
        this.sprite.setCollideWorldBounds(true);
        this.createAnimations();
        this.sprite.anims.play(Basilisk.animations.restRight, true);
        this.scene.cameras.main.startFollow(this.sprite);
    };

    update = () => {
        const cursors = this.scene.input.keyboard.createCursorKeys();

        if (this.jesusModeStatus === Basilisk.JESUS_MODE_STATUSES.SUBMERGED) {
            if (cursors.left.isDown) {
                this.runLeft();
            } else if (cursors.right.isDown) {
                this.runRight();
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
        this.direction = Basilisk.DIRECTION.LEFT;
        this.sprite.body.setOffset(0, 0);
    };

    runRight = () => {
        this.sprite.setVelocityX(1 * SPEED * this.speed);
        this.sprite.anims.play(Basilisk.animations.runRight, true);
        this.direction = Basilisk.DIRECTION.RIGHT;
        this.sprite.body.setOffset(125, 0);
    };

    jump = () => {
        this.sprite.setVelocityY(-1 * Math.max(300, SPEED * this.speed));
    };

    /**
     * @param {Boolean} isRight - true if the lizard should face right
     */
    setDirection = isRight => {
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
}
