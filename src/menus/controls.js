import { game } from '../game';
import * as LevelManager from '../game/levels/LevelManager';
import { subscribe, dispatch, getState, types } from '../game/state';
import { renderModal } from './modal';

function configureMuteButton() {
    const muteButton = document.getElementById('toggle-mute');

    const muteSubscriber = state => {
        if (state.muted) {
            game.sound.mute = true;
            muteButton.title = 'Unmute';
            muteButton.className = 'active';
            muteButton.innerHTML = '<span class="fas fa-volume-mute"></span>';
        } else {
            game.sound.mute = false;
            muteButton.title = 'Mute';
            muteButton.className = '';
            muteButton.innerHTML = '<span class="fas fa-volume-up"></span>';
        }
    };
    subscribe(muteSubscriber);

    muteButton.addEventListener('click', function(evt) {
        let muted = getState().muted;
        dispatch({ type: muted ? types.UNMUTE : types.MUTE });
    });
}

function configurePauseButton() {
    const pauseButton = document.getElementById('toggle-pause');

    const pauseSubscriber = state => {
        if (state.paused) {
            pauseButton.title = 'Resume';
            pauseButton.className = 'active';
            pauseButton.innerHTML = '<span class="fas fa-play"></span>';
        } else {
            pauseButton.title = 'Pause';
            pauseButton.className = '';
            pauseButton.innerHTML = '<span class="fas fa-pause"></span>';
        }
    };
    subscribe(pauseSubscriber);

    pauseButton.addEventListener('click', function(evt) {
        let paused = getState().paused;
        dispatch({ type: paused ? types.RESUME : types.PAUSE });
    });

    window.addEventListener('keyup', evt => {
        let paused = getState().paused;
        if (evt.key == ' ' || evt.key.toLowerCase() === 'spacebar') {
            dispatch({ type: paused ? types.RESUME : types.PAUSE });
        }
    });
}

function configureRestartButton() {
    const restartButton = document.getElementById('toggle-restart');

    restartButton.title = 'Restart level';
    restartButton.innerHTML = '<span class="fas fa-redo"></span>';

    restartButton.addEventListener('click', function(evt) {
        dispatch({ type: types.PAUSE });

        renderModal({
            contentText: '<p>Restart this level?</p>',
            confirmText: '✔ Restart',
            cancelText: '✕ Cancel',
            onConfirm: () => {
                LevelManager.restartCurrentLevel();
                dispatch({ type: types.RESUME });
            },
            onCancel: () => {
                dispatch({ type: types.RESUME });
            },
        });
    });
}

function configureMenuButton() {
    const menuButton = document.getElementById('toggle-menu');
    menuButton.innerHTML = '<span class="fas fa-bars"></span>';
    menuButton.title = 'Open level menu';
    menuButton.addEventListener('click', () => {
        let isMenuOpen = getState().isMenuOpen;
        dispatch({ type: isMenuOpen ? types.CLOSE_MENU : types.OPEN_MENU });
    });

    const menuSubscriber = state => {
        menuButton.className = state.isMenuOpen ? 'active' : '';
    };
    subscribe(menuSubscriber);
}

function configureActiveLevel() {
    const activeLevelSpan = document.getElementById('active-level');

    const levelSubscriber = state => {
        activeLevelSpan.innerHTML = LevelManager.getLevelByKey(
            state.level
        ).title;
    };
    subscribe(levelSubscriber);
}

function configureZoom() {
    const zoomOut = document.getElementById('zoom-out');

    zoomOut.innerHTML = '<span class="fas fa-search-minus"></span>';
    zoomOut.title = 'Zoom out';
    zoomOut.addEventListener('click', () => {
        dispatch({ type: types.ZOOM_OUT });
    });

    const zoomIn = document.getElementById('zoom-in');
    zoomIn.innerHTML = '<span class="fas fa-search-plus"></span>';
    zoomIn.title = 'Zoom in';
    zoomIn.addEventListener('click', () => {
        dispatch({ type: types.ZOOM_IN });
    });

    const zoomSubscriber = state => {
        zoomIn.className = state.zoom >= 1 ? 'active' : '';
        zoomOut.className = state.zoom < 1 ? 'active' : '';
    };

    subscribe(zoomSubscriber);
}

export function registerControls() {
    configureMuteButton();
    configurePauseButton();
    configureRestartButton();
    configureMenuButton();
    configureActiveLevel();
    configureZoom();
}
