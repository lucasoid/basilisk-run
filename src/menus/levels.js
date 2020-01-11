import { subscribe, dispatch, types, getState } from '../game/state';
import { renderModal } from './modal';
import * as LevelManager from '../game/levels/LevelManager';

function promptChangeLevel(level) {
    dispatch({ type: types.PAUSE });

    renderModal({
        contentText: `<p>Switch to ${level.title}?</p>`,
        confirmText: '✔ Yes',
        cancelText: '✕ Cancel',
        onConfirm: () => {
            dispatch({ type: types.SET_LEVEL, level: level.key });
            dispatch({ type: types.RESUME });
        },
        onCancel: () => {
            dispatch({ type: types.RESUME });
        },
    });
}

function configureLevels() {
    const levelMenu = document.getElementById('level-menu');
    const levelList = document.getElementById('level-list');

    const levelSubscriber = state => {
        levelMenu.className = state.isMenuOpen ? 'open' : 'closed';

        let activeLevel = LevelManager.getLevelByKey(state.level);
        levelList.innerHTML = '';
        LevelManager.levels.forEach(level => {
            let el = document.createElement('a');
            el.className =
                level.key === activeLevel.key ? 'level active' : 'level';
            el.innerHTML = level.title;
            el.addEventListener('click', evt => {
                if (level.key !== activeLevel.key) {
                    promptChangeLevel(level);
                }
            });
            levelList.appendChild(el);
        });
    };
    subscribe(levelSubscriber);

    const closeButton = document.getElementById('menu-close');
    closeButton.addEventListener('click', () => {
        dispatch({ type: types.CLOSE_MENU });
    });
}

export function registerLevelsMenu() {
    configureLevels();
}
