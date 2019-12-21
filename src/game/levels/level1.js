import { Level } from './Level';
import level1Map from './tilemaps/Level1.json';

const GROUND_HEIGHT = 48;

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

    createPrey = () => {
        const beetleHeight = 960 - GROUND_HEIGHT - 10;
        let beetles = {};
        const setRespawningBeetle = (x, y, i) => {
            beetles[i] = this.spawnBeetle(x, y, () => {
                delete beetles[i];
                setTimeout(() => {
                    beetles[i] = setRespawningBeetle(x, y, i);
                }, 3000);
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
    };

    onWinLevel = () => {
        this.scene.stop();
        this.scene.start('StageComplete', { level: 1, transitionTo: 'Level2' });
    };
}
