import { Scene } from 'phaser';
import constants from '../constants';
import bgImg from '../assets/forest-aerial.png';

export class StageComplete extends Scene {
    level;
    transitionTo;

    init = data => {
        this.level = (data && data.level) || '';
        this.transitionTo = (data && data.transitionTo) || null;
    };

    preload = () => {
        if (!this.textures.exists('transitionBg'))
            this.load.image('transitionBg', bgImg);
    };

    create = () => {
        const background = this.add.image(
            constants.screen.WIDTH / 2,
            constants.screen.HEIGHT / 2,
            'transitionBg'
        );
        background.setScrollFactor(0);
        const textWidth = 300;
        const text = this.add.text(
            constants.screen.WIDTH / 2 - textWidth / 2,
            constants.screen.HEIGHT / 2,
            `${this.level} complete!`,
            {
                fontSize: '30px',
                fontFamily: constants.styles.fontStack,
                fixedWidth: textWidth,
            }
        );
        text.setAlign('center');

        setTimeout(() => {
            this.scene.stop();
            this.scene.start(this.transitionTo);
        }, 2000);
    };
}
