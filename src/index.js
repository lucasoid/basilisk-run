import { mountGame } from './game';
import { dispatch, types, subscribe, getState } from './game/state';

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

configureMuteButton();
