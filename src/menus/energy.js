import { subscribe } from '../game/state';
import constants from '../game/constants';

function configureEnergyMeter() {
    const energyMeter = document.getElementById('energy-meter');

    function createEnergyBar(i) {
        const el = document.createElement('div');
        el.className = 'energy-bar';
        el.style = `width: ${(100 * 1) / constants.player.maxEnergy}%`;
        el.id = `energy-bar-${i}`;
        energyMeter.appendChild(el);
        return el;
    }

    for (let i = 0; i < constants.player.maxEnergy; i++) {
        createEnergyBar(i + 1);
    }

    const energySubscriber = state => {
        for (let i = 0; i < constants.player.maxEnergy; i++) {
            let el = document.getElementById(`energy-bar-${i + 1}`);
            el.className =
                state.energyLevel >= i + 1 ? 'energy-bar active' : 'energy-bar';
        }
    };
    subscribe(energySubscriber);
}

export function registerEnergyMeter() {
    configureEnergyMeter();
}
