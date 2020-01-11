import { subscribe, dispatch, types } from '../game/state';
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

        let activeIndex = LevelManager.levels.findIndex(
            l => l.key === state.level
        );
        let highestIndex = LevelManager.levels.findIndex(
            l => l.key === state.highestLevel
        );

        levelList.innerHTML = '';
        LevelManager.levels.forEach((level, i) => {
            let el = document.createElement('a');
            el.className = level.key === state.level ? 'level active' : 'level';
            const icon =
                i === activeIndex
                    ? 'fa-arrow-right'
                    : i === highestIndex
                    ? 'fa-lock-open'
                    : i < highestIndex
                    ? 'fa-check'
                    : 'fa-lock';
            el.innerHTML = `<span class="fa ${icon}"></span> ${level.title}`;
            if (i <= highestIndex) {
                el.addEventListener('click', evt => {
                    if (level.key !== state.level) {
                        promptChangeLevel(level);
                    }
                });
            }

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
