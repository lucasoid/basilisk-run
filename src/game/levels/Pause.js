import { Scene } from 'phaser';
import constants from '../constants';

export class Pause extends Scene {
    constructor(config) {
        super(config);
    }

    create = () => {
        this.cameras.main.setBackgroundColor('rgba(255, 255, 255, 0.5)');
        const textWidth = 300;
        const text = this.add.text(
            constants.screen.WIDTH / 2 - textWidth / 2,
            constants.screen.HEIGHT / 2,
            `Paused`,
            {
                fontSize: '24px',
                fontFamily: constants.styles.fontStack,
                fixedWidth: textWidth,
            }
        );
        text.setAlign('center');
    };
}
