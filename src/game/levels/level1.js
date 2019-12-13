import { Level } from './Level';
import level1Map from './tilemaps/Level1.json';

const GROUND_HEIGHT = 72;

export class Level1 extends Level {
    constructor(config) {
        super(config);
        this.tilemapKey = 'level1Map';
        this.tilemap = level1Map;
        this.basilisk.startX = 100;
        this.basilisk.startY = 960 - GROUND_HEIGHT - 100;
        this.targetPosition = {
            x: 6720 - 100,
            y: 960 - GROUND_HEIGHT - 100,
        };
    }

    onWinLevel = () => {
        this.scene.stop();
        this.scene.start('StageComplete', { level: 1, transitionTo: 'Level2' });
    };
}
