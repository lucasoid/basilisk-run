import { mountGame } from './game';
import { dispatch, types, subscribe, getState } from './game/state';
import * as LevelManager from './game/levels/LevelManager';

const el = document.getElementById('root');
const game = mountGame(el);

// controls

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

        const confirmText = document.createElement('p');
        confirmText.innerHTML = 'Restart this level?';

        const confirm = document.createElement('button');
        confirm.className = 'primary';
        confirm.innerHTML = '✔ Restart';

        const cancel = document.createElement('button');
        cancel.innerHTML = '✕ Cancel';
        cancel.className = 'secondary';

        const buttonDiv = document.createElement('div');
        buttonDiv.className = 'modal-footer';
        buttonDiv.appendChild(cancel);
        buttonDiv.appendChild(confirm);

        const content = document.getElementById('modal-content');
        content.style = 'text-align: center';
        content.appendChild(confirmText);
        content.appendChild(buttonDiv);

        confirm.addEventListener('click', function(evt) {
            LevelManager.restartCurrentLevel();
            dispatch({ type: types.RESUME });
            closeModal();
        });

        cancel.addEventListener('click', function(evt) {
            closeModal();
            dispatch({ type: types.RESUME });
        });

        openModal();
    });
}

function openModal() {
    document.getElementById('modal-wrap').style = 'display: block';
}

function closeModal() {
    document.getElementById('modal-wrap').style = 'display: hidden';
    document.getElementById('modal-content').innerHTML = '';
    document.getElementById('modal-content').style = '';
}

document.getElementById('modal-close').addEventListener('click', function(evt) {
    closeModal();
});

configureMuteButton();
configurePauseButton();
configureRestartButton();
