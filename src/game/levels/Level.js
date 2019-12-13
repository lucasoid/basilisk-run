import { Scene } from 'phaser';
import constants from '../constants';
import { Basilisk } from '../models/Basilisk';
import { EnergyMeter } from '../models/EnergyMeter';
import tileset from '../assets/tileset.png';
import skyImg from '../assets/sky-day.png';
import eggImg from '../assets/egg.png';

const basilisk = new Basilisk();
const energyMeter = new EnergyMeter(basilisk);

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
        this.basilisk = new Basilisk();
        this.energyMeter = new EnergyMeter(basilisk);
    }

    preload = () => {
        if (!this.textures.exists('sky')) this.load.image('sky', skyImg);
        if (!this.textures.exists('tiles')) this.load.image('tiles', tileset);
        if (!this.textures.exists('egg')) this.load.image('egg', eggImg);
        if (!this.textures.exists(this.tilemapKey))
            this.load.tilemapTiledJSON(this.tilemapKey, this.tilemap);
        basilisk.preload(this);
        energyMeter.preload(this);
    };

    create = () => {
        const background = this.add.image(
            constants.scene.WIDTH / 2,
            constants.scene.HEIGHT / 2,
            'sky'
        );
        background.setScrollFactor(0);

        const map = this.make.tilemap({ key: this.tilemapKey });
        const tileset = map.addTilesetImage('base', 'tiles');

        this.ground = map.createStaticLayer('Ground', tileset, 0, 0);
        this.water = map.createStaticLayer('Water', tileset, 0, 0);
        this.shoreline = map.createStaticLayer('Shoreline', tileset, 0, 0);

        this.ground.setCollisionByProperty({ collides: true });
        this.water.setCollisionByProperty({ collides: true });
        this.shoreline.setCollisionByProperty({ collides: true });

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

        this.egg = this.physics.add.sprite(
            this.targetPosition.x,
            this.targetPosition.y,
            'egg'
        );
        this.physics.add.collider(this.ground, this.egg);
        this.physics.add.collider(this.shoreline, this.egg);

        basilisk.create(
            this,
            { ground: this.ground, water: this.water, shore: this.shoreline },
            this.lizardPosition
        );
        energyMeter.create(this);

        this.physics.add.overlap(basilisk.sprite, this.egg, () => {
            this.onWinLevel();
        });
    };

    update = () => {
        basilisk.update(this);
    };
}
