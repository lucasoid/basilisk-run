import level1Map from './Level1.json';
import tileset from '../assets/tileset.png';
import sky from '../assets/sky-day.png';
import constants from '../constants';

export const preload = game => {
    game.load.image('sky', sky);
    game.load.image('tiles', tileset);
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
    const ground = map.createStaticLayer('Ground', tileset, 0, 0);
    const water = map.createStaticLayer('Water', tileset, 0, 0);
    ground.setCollisionByProperty({ collides: true });
    water.setCollisionByProperty({ collides: true });
    game.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    game.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    return { ground, water };
};
