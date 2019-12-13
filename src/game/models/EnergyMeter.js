import energy0 from '../assets/energy-0.png';
import energy1 from '../assets/energy-1.png';
import energy2 from '../assets/energy-2.png';
import energy3 from '../assets/energy-3.png';
import energy4 from '../assets/energy-4.png';

const X_OFFSET = 30;
const Y_OFFSET = 30;
const BAR_WIDTH = 15;
const BAR_HEIGHT = 30;
const GUTTER = 3;

export class EnergyMeter {
    bars = {};
    player = null;

    constructor(scene, player) {
        this.scene = scene;
        this.player = player;
    }

    updateMeter = (next, prev) => {
        Object.keys(this.bars).forEach(key => {
            this.bars[key].visible = key <= next ? true : false;
        });
    };

    preload = () => {
        this.scene.load.image('energy0', energy0);
        this.scene.load.image('energy1', energy1);
        this.scene.load.image('energy2', energy2);
        this.scene.load.image('energy3', energy3);
        this.scene.load.image('energy4', energy4);
    };

    create = () => {
        for (let i = 1; i <= this.player.constructor.maxEnergy; i++) {
            const x = X_OFFSET + BAR_WIDTH / 2 + BAR_WIDTH * i + GUTTER * i;
            const y = Y_OFFSET + BAR_HEIGHT / 2;
            let emptyBar = this.scene.add.image(x, y, 'energy0');
            this.bars[i] = this.scene.add.image(
                x,
                y,
                `energy${Math.min(4, Math.ceil(i / 3))}`
            );
            emptyBar.setScrollFactor(0);
            this.bars[i].setScrollFactor(0);
        }
        this.updateMeter(this.player.energy);
        this.player.onUpdateEnergy(this.updateMeter);
    };
}
