import { subscribe, dispatch, getState, types } from '../game/state';
import { renderModal } from './modal';
import * as LevelManager from '../game/levels/LevelManager';
import { game } from '../game';

function configureMuteButton() {
    const muteButton = document.getElementById('toggle-mute');

    const muteSubscriber = state => {
        if (state.muted) {
            game.sound.mute = true;
            muteButton.title = 'Unmute';
            muteButton.className = 'muted';
            muteButton.innerHTML = '<span class="fas fa-volume-mute"></span>';
        } else {
            game.sound.mute = false;
            muteButton.title = 'Mute';
            muteButton.className = 'unmuted';
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
            pauseButton.className = 'paused';
            pauseButton.innerHTML = '<span class="fas fa-play"></span>';
        } else {
            pauseButton.title = 'Pause';
            pauseButton.className = 'playing';
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

export function registerControls() {
    configureMuteButton();
    configurePauseButton();
    configureRestartButton();
}
