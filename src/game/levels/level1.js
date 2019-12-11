import level1Map from './Level1.json';
import tileset from '../assets/tileset.png';
import skyImg from '../assets/sky-day.png';
import eggImg from '../assets/egg.png';
import constants from '../constants';

export let egg, ground, water, shoreline;

export const preload = game => {
    game.load.image('sky', skyImg);
    game.load.image('tiles', tileset);
    game.load.image('egg', eggImg);
    game.load.tilemapTiledJSON('map', level1Map);
};

export const create = game => {
    const background = game.add.image(
        constants.scene.WIDTH / 2,
        constants.scene.HEIGHT / 2,
        'sky'
    );
    background.setScrollFactor(0);

    const map = game.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('base', 'tiles');

    ground = map.createStaticLayer('Ground', tileset, 0, 0);
    water = map.createStaticLayer('Water', tileset, 0, 0);
    shoreline = map.createStaticLayer('Shoreline', tileset, 0, 0);

    ground.setCollisionByProperty({ collides: true });
    water.setCollisionByProperty({ collides: true });
    shoreline.setCollisionByProperty({ collides: true });

    game.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    game.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    egg = game.physics.add.sprite(map.widthInPixels - 150, 150, 'egg');
    game.physics.add.collider(ground, egg);
    game.physics.add.collider(shoreline, egg);
};
