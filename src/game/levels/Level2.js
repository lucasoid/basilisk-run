import { Level } from './Level';
import level2Map from './tilemaps/Level2.json';

const GROUND_HEIGHT = 72;

export class Level2 extends Level {
    constructor(config) {
        super(config);
        this.tilemapKey = 'level2Map';
        this.tilemap = level2Map;
        this.lizardPosition = {
            x: 100,
            y: 960 - GROUND_HEIGHT - 100,
        };
        this.targetPosition = {
            x: 6720 - 100,
            y: 960 - GROUND_HEIGHT - 100,
        };
    }

    onWinLevel = () => {
        this.scene.stop();
        this.scene.start('StageComplete', { level: 2, transitionTo: 'Level1' });
    };
}
