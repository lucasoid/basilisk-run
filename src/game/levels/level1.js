import { Level } from './Level';
import level1Map from './tilemaps/Level1.json';

const GROUND_HEIGHT = 48;

export class Level1 extends Level {
    constructor(config) {
        super(config);
        this.tilemapKey = 'level1Map';
        this.tilemap = level1Map;
        this.basilisk.startX = 200;
        this.basilisk.startY = 960 - GROUND_HEIGHT - 100;
    }
}
