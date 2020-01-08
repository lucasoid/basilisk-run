import Phaser from 'phaser';
import constants from './constants';
import { Level1 } from './levels/Level1';
import { Level2 } from './levels/Level2';
import { StageComplete } from './levels/StageComplete';

export function mountGame(el) {
    let game = new Phaser.Game({
        parent: el,
        type: Phaser.AUTO,
        width: constants.screen.WIDTH,
        height: constants.screen.HEIGHT,
        physics: {
            default: 'arcade',
            arcade: {
                // debug: true,
                gravity: { y: 500 },
            },
        },
    });

    const level1 = new Level1({ active: true, visible: false });
    const level2 = new Level2({ active: false, visible: false });
    game.scene.add('Level1', level1);
    game.scene.add(
        'StageComplete',
        new StageComplete({ active: false, visible: false })
    );
    game.scene.add('Level2', level2);

    game.scene.start('Level1');

    return game;
}
