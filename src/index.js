import { mountGame } from './game';
import { registerControls } from './menus/controls';
import { registerLevelsMenu } from './menus/levels';

const el = document.getElementById('root');
const game = mountGame(el);

registerControls();
registerLevelsMenu();
