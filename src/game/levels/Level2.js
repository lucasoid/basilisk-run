import { Level } from './Level';
import level2Map from './tilemaps/Level2.json';

const GROUND_HEIGHT = 144;

export class Level2 extends Level {
    constructor(config) {
        super(config);
        this.tilemapKey = 'level2Map';
        this.tilemap = level2Map;
        this.basilisk.startX = 100;
        this.basilisk.startY = 960 - GROUND_HEIGHT - 100;
    }
}
