import { Level } from './Level';
import level1Map from './tilemaps/Level1.json';
import { advanceToNextLevel } from './LevelManager';

const GROUND_HEIGHT = 48;

export class Level1 extends Level {
    constructor(config) {
        super(config);
        this.tilemapKey = 'level1Map';
        this.tilemap = level1Map;
        this.basilisk.startX = 200;
        this.basilisk.startY = 960 - GROUND_HEIGHT - 100;
        this.targetPosition = {
            x: 9600 - 144,
            y: 960 - GROUND_HEIGHT - 10,
        };
        this.timeouts = [];
    }

    createPrey = () => {
        const beetleHeight = 960 - GROUND_HEIGHT - 10;
        let beetles = {};
        const setRespawningBeetle = (x, y, i) => {
            beetles[i] = this.spawnBeetle(x, y, () => {
                delete beetles[i];
                let tid = setTimeout(() => {
                    beetles[i] = setRespawningBeetle(x, y, i);
                }, 3000);
                this.timeouts.push(tid);
            });
        };
        setRespawningBeetle(400, beetleHeight, '_1');
        setRespawningBeetle(1300, beetleHeight, '_2');
        setRespawningBeetle(1800, beetleHeight, '_3');
        setRespawningBeetle(2200, beetleHeight, '_4');
        setRespawningBeetle(3200, beetleHeight, '_5');
        setRespawningBeetle(3500, beetleHeight, '_6');
        setRespawningBeetle(4800, beetleHeight, '_7');
        setRespawningBeetle(5500, beetleHeight, '_8');
        setRespawningBeetle(5500, beetleHeight, '_9');
        setRespawningBeetle(5500, beetleHeight, '_10');

        const butterflyHeight = 960 - GROUND_HEIGHT - 40;
        let butterflies = {};
        const setRespawningButterfly = (x, y, i) => {
            butterflies[i] = this.spawnButterfly(x, y, () => {
                delete butterflies[i];
                let tid = setTimeout(() => {
                    butterflies[i] = setRespawningButterfly(x, y, i);
                }, 3000);
                this.timeouts.push(tid);
            });
        };
        setRespawningButterfly(500, butterflyHeight, '_1');
        setRespawningButterfly(1900, butterflyHeight, '_3');
        setRespawningButterfly(3300, butterflyHeight, '_5');
        setRespawningButterfly(4900, butterflyHeight, '_7');
        setRespawningButterfly(5600, butterflyHeight, '_9');
    };

    onWinLevel = () => {
        advanceToNextLevel();
        this.timeouts.forEach(tid => clearTimeout(tid));
    };
}
