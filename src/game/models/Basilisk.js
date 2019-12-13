import basiliskSprites from '../assets/basilisk-sprites.png';

const SPEED = 400;

export class Basilisk {
    static handle = 'basilisk';
    static animations = {
        runLeft: 'runLeft',
        runRight: 'runRight',
    };
    static defaultEnergy = 8;
    static maxEnergy = 24;
    static defaultSpeed = 1;
    static maxSpeed = 3;
    static jesusModeIntervalLength = 250;
    sprite = null;
    energy = Basilisk.defaultEnergy;
    speed = Basilisk.defaultSpeed;
    energyCallbacks = [];
    speedCallbacks = [];
    jesusModeInterval = null;

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
        this.setEnergy(0);
        this.setSpeed(0.5);
    }

    emerge() {
        clearInterval(this.jesusModeInterval);
        this.jesusModeInterval = null;
        this.setEnergy(Basilisk.defaultEnergy);
        this.setSpeed(Basilisk.defaultSpeed);
    }

    startJesusMode = () => {
        this.jesusModeInterval = setInterval(() => {
            if (this.energyLevel === 0) {
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

    preload = game => {
        if (!game.textures.exists(Basilisk.handle))
            game.load.spritesheet(Basilisk.handle, basiliskSprites, {
                frameWidth: 250,
                frameHeight: 137.33,
            });
    };

    create = (game, { ground, water, shore, goal }, lizardPosition) => {
        this.sprite = game.physics.add.sprite(
            lizardPosition.x,
            lizardPosition.y,
            Basilisk.handle
        );
        this.sprite.setBounce(0.1);
        this.sprite.setCollideWorldBounds(true);
        game.anims.create({
            key: 'runLeft',
            // frames are 0-index
            frames: game.anims.generateFrameNumbers(Basilisk.handle, {
                start: 11,
                end: 8,
            }),
            frameRate: 10,
            repeat: -1,
        });
        game.anims.create({
            key: 'runRight',
            frames: game.anims.generateFrameNumbers(Basilisk.handle, {
                start: 4,
                end: 7,
            }),
            frameRate: 10,
            repeat: -1,
        });
        game.cameras.main.startFollow(this.sprite);
        // sink or swim logic:
        game.physics.add.collider(
            this.sprite,
            ground,
            () => {
                if (this.energy < Basilisk.defaultEnergy) {
                    this.emerge();
                }
            },
            null
        );
        game.physics.add.collider(
            this.sprite,
            water,
            () => {
                if (this.sprite.body.velocity.x === 0 && this.energy > 0) {
                    this.submerge();
                } else if (this.jesusModeInterval === null)
                    this.startJesusMode();
            },
            () => this.energy > 0
        );
        game.physics.add.collider(this.sprite, shore);
    };

    update = game => {
        const cursors = game.input.keyboard.createCursorKeys();

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
}
