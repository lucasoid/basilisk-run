import { mountGame } from './game';
import { registerControls } from './menus/controls';
import { registerLevelsMenu } from './menus/levels';
import { registerEnergyMeter } from './menus/energy';

const el = document.getElementById('root');
const game = mountGame(el);

registerEnergyMeter();
registerControls();
registerLevelsMenu();
