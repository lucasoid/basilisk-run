import { Level } from './Level';
import level2Map from './tilemaps/Level1.json';
import { dispatch, types } from '../state';
import { levels } from './LevelManager';

const GROUND_HEIGHT = 72;

export class Level2 extends Level {
    constructor(config) {
        super(config);
        this.tilemapKey = 'level2Map';
        this.tilemap = level2Map;
        this.basilisk.startX = 100;
        this.basilisk.startY = 960 - GROUND_HEIGHT - 100;
        this.targetPosition = {
            x: 6720 - 100,
            y: 960 - GROUND_HEIGHT - 100,
        };
    }

    createPrey = () => {
        this.spawnBeetle(300, 960 - GROUND_HEIGHT - 10);
    };

    onWinLevel = () => {
        dispatch({ type: types.SET_LEVEL, level: levels.LEVEL1.key });
    };
}
