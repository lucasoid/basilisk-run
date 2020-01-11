import { Scene } from 'phaser';
import constants from '../constants';
import { Basilisk } from '../models/Basilisk';
import { EnergyMeter } from '../models/EnergyMeter';
import { Beetle } from '../models/Beetle';
import { Butterfly } from '../models/Butterfly';
import tileset from '../assets/tiles.png';
import skyImg from '../assets/sky-day.png';
import eggImg from '../assets/egg.png';
import hatch from '../assets/sfx/hatch.wav';

export class Level extends Scene {
    energyMeter;
    basilisk;
    ground;
    water;
    shore;
    target;
    background;
    tilemapKey;
    tilemap;
    prey = [];
    sfx = {};

    constructor(config) {
        super(config);
        this.basilisk = new Basilisk(this);
        this.energyMeter = new EnergyMeter(this, this.basilisk);
    }

    preload = () => {
        if (!this.textures.exists('sky')) this.load.image('sky', skyImg);
        if (!this.textures.exists('tiles')) this.load.image('tiles', tileset);
        if (!this.textures.exists('egg')) this.load.image('egg', eggImg);
        if (!this.textures.exists(this.tilemapKey))
            this.load.tilemapTiledJSON(this.tilemapKey, this.tilemap);
        this.basilisk.preload();
        this.energyMeter.preload();
        Beetle.preload(this);
        Butterfly.preload(this);
        this.load.audio('hatch', hatch);
    };

    create = () => {
        this.createBackground();
        const map = this.make.tilemap({ key: this.tilemapKey });
        const tileset = map.addTilesetImage('tiles', 'tiles', 24, 24, 1, 2);
        map.createStaticLayer('Undercoat', tileset, 0, 0);
        this.createTarget();
        this.createGround(tileset, map);
        this.createWater(tileset, map);
        this.createShore(tileset, map);
        map.createStaticLayer('Topcoat', tileset, 0, 0);
        this.createBounds(map);
        this.basilisk.create();
        map.createStaticLayer('WaterEffect', tileset, 0, 0);
        this.energyMeter.create();
        this.setTarget();
        this.sinkOrSwim();
        this.createPrey();
        this.sfx.hatch = this.sound.add('hatch');
    };

    update = () => {
        this.basilisk.update();
        this.prey.forEach(prey => prey.update());
    };

    createBackground = () => {
        this.background = this.add.image(
            constants.screen.WIDTH / 2,
            constants.screen.HEIGHT / 2,
            'sky'
        );
        this.background.setScrollFactor(0);
    };

    createGround = (tileset, map) => {
        this.ground = map.createStaticLayer('Ground', tileset, 0, 0);
        this.ground.setCollisionByProperty({ collides: true });
    };

    createWater = (tileset, map) => {
        this.water = map.createStaticLayer('Water', tileset, 0, 0);
        this.water.setCollisionByProperty({ collides: true });
    };

    createShore = (tileset, map) => {
        this.shore = map.createStaticLayer('Shore', tileset, 0, 0);
        this.shore.setCollisionByProperty({ collides: true });
    };

    createBounds = map => {
        this.physics.world.setBounds(
            0,
            0,
            map.widthInPixels,
            map.heightInPixels
        );
        this.cameras.main.setBounds(
            0,
            0,
            map.widthInPixels,
            map.heightInPixels
        );
    };

    sinkOrSwim = () => {
        // sink or swim logic:
        this.physics.add.collider(
            this.basilisk.sprite,
            this.ground,
            () => {
                if (
                    this.basilisk.jesusModeStatus !==
                    Basilisk.JESUS_MODE_STATUSES.INACTIVE
                ) {
                    this.basilisk.emerge();
                }
            },
            null
        );
        this.physics.add.collider(
            this.basilisk.sprite,
            this.water,
            () => {
                if (
                    this.basilisk.sprite.body.velocity.x === 0 &&
                    this.basilisk.energy > 0
                ) {
                    this.basilisk.submerge();
                } else if (
                    this.basilisk.jesusModeStatus !==
                    Basilisk.JESUS_MODE_STATUSES.ACTIVE
                ) {
                    this.basilisk.startJesusMode();
                }
            },
            () => this.basilisk.energy > 0
        );
        this.physics.add.collider(this.basilisk.sprite, this.shore);
    };

    createTarget = () => {
        this.target = this.physics.add.group({
            name: 'eggs',
        });
        for (let i = 0; i < 3; i++) {
            let egg = this.physics.add.image(
                this.targetPosition.x + 24 - i * 24,
                this.targetPosition.y,
                'egg'
            );
            this.target.add(egg);
        }
    };

    setTarget = () => {
        this.physics.add.collider(this.ground, this.target);
        this.physics.add.collider(this.shore, this.target);
        this.physics.add.overlap(this.basilisk.sprite, this.target, () => {
            this.sfx.hatch.play();
            this.onWinLevel();
        });
    };

    // abstract
    createPrey = () => {};

    spawnBeetle = (x, y, onDestroy = () => {}) => {
        const beetle = new Beetle(this, this.basilisk);
        beetle.startX = x;
        beetle.startY = y;
        beetle.create();
        this.prey.push(beetle);
        this.physics.add.collider(this.ground, beetle.sprite);
        this.physics.add.collider(this.shore, beetle.sprite);
        this.physics.add.collider(this.water, beetle.sprite);
        this.physics.add.collider(
            this.basilisk.sprite,
            beetle.sprite,
            () => {
                beetle.sprite.destroy();
                onDestroy();
                this.basilisk.changeEnergy(3);
            },
            () => {
                if (this.basilisk.sprite.body.velocity.x === 0) return false;
                // cuz you don't eat with your tail
                if (
                    this.basilisk.sprite.body.velocity.x < 0 &&
                    beetle.sprite.x < this.basilisk.sprite.x
                )
                    return true;
                if (
                    this.basilisk.sprite.body.velocity.x > 0 &&
                    beetle.sprite.x > this.basilisk.sprite.x
                )
                    return true;
                return false;
            }
        );
        return beetle;
    };

    spawnButterfly = (x, y, onDestroy = () => {}) => {
        const butterfly = new Butterfly(this, this.basilisk);
        butterfly.startX = x;
        butterfly.startY = y;
        butterfly.create();
        this.prey.push(butterfly);
        butterfly.startFluttering();
        this.physics.add.collider(this.ground, butterfly.sprite);
        this.physics.add.collider(this.shore, butterfly.sprite);
        this.physics.add.collider(this.water, butterfly.sprite);
        this.physics.add.collider(
            this.basilisk.sprite,
            butterfly.sprite,
            () => {
                butterfly.sprite.destroy();
                onDestroy();
                this.basilisk.changeEnergy(3);
            },
            null
        );
        return butterfly;
    };
}
