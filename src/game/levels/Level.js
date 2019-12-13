import { Scene } from 'phaser';
import constants from '../constants';
import { Basilisk } from '../models/Basilisk';
import { EnergyMeter } from '../models/EnergyMeter';
import tileset from '../assets/tileset.png';
import skyImg from '../assets/sky-day.png';
import eggImg from '../assets/egg.png';

export class Level extends Scene {
    energyMeter;
    basilisk;
    ground;
    water;
    shore;
    egg;
    background;
    tilemapKey;
    tilemap;

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
    };

    create = () => {
        this.createBackground();
        const map = this.make.tilemap({ key: this.tilemapKey });
        const tileset = map.addTilesetImage('base', 'tiles');
        this.createGround(tileset, map);
        this.createWater(tileset, map);
        this.createShore(tileset, map);
        this.createBounds(map);
        this.basilisk.create();
        this.energyMeter.create();
        this.createTarget();
        this.sinkOrSwim();
        this.physics.add.collider(this.basilisk.sprite, this.shore);
    };

    update = () => {
        this.basilisk.update();
    };

    createBackground = () => {
        const background = this.add.image(
            constants.scene.WIDTH / 2,
            constants.scene.HEIGHT / 2,
            'sky'
        );
        background.setScrollFactor(0);
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
        this.shore = map.createStaticLayer('Shoreline', tileset, 0, 0);
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
                if (this.basilisk.energy < Basilisk.defaultEnergy) {
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
                } else if (this.basilisk.jesusModeInterval === null)
                    this.basilisk.startJesusMode();
            },
            () => this.basilisk.energy > 0
        );
    };

    createTarget = () => {
        this.egg = this.physics.add.sprite(
            this.targetPosition.x,
            this.targetPosition.y,
            'egg'
        );
        this.physics.add.collider(this.ground, this.egg);
        this.physics.add.collider(this.shore, this.egg);
        this.physics.add.overlap(this.basilisk.sprite, this.egg, () => {
            this.onWinLevel();
        });
    };
}
