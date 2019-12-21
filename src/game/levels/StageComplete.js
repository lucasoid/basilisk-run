import { Scene } from 'phaser';
import { Basilisk } from '../models/Basilisk';
import constants from '../constants';

export class StageComplete extends Scene {
    level;
    transitionTo;

    init = data => {
        this.level = data.level;
        this.transitionTo = data.transitionTo;
    };

    create = () => {
        const textWidth = 300;
        const text = this.add.text(
            constants.screen.WIDTH / 2 - textWidth / 2,
            constants.screen.HEIGHT / 2,
            `Level ${this.level} complete!`,
            {
                fontSize: '30px',
                fontFamily: constants.styles.fontStack,
                fixedWidth: textWidth,
            }
        );
        text.setAlign('center');

        // lizard spin
        let basiliskSprite = this.physics.add.sprite(
            constants.screen.WIDTH / 2,
            constants.screen.HEIGHT / 2,
            Basilisk.handle
        );
        let i = 0;
        let interval = setInterval(() => {
            basiliskSprite.setAngle(i * 30).setScale(1 / (1 + i * 0.1));
            if (i * 30 >= 720) {
                clearInterval(interval);
                basiliskSprite.destroy();
                setTimeout(() => {
                    this.scene.stop();
                    this.scene.start(this.transitionTo);
                }, 2000);
            }
            i++;
        }, 25);
    };
}
