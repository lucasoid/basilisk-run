import { mountGame } from './game';

const el = document.getElementById('root');
const game = mountGame(el);

// controls

function configureMuteButton() {
    const muteButton = document.getElementById('toggle-mute');

    function setMuteButton(isMuted) {
        muteButton.innerHTML = isMuted
            ? '<span class="fas fa-volume-mute"></span>'
            : '<span class="fas fa-volume-up"></span>';
        muteButton.title = isMuted ? 'Unmute' : 'Mute';
        muteButton.className = isMuted ? 'muted' : 'unmuted';
    }

    setMuteButton(true);

    muteButton.addEventListener('click', function(evt) {
        const currentValue = game.sound.mute;
        game.sound.setMute(!currentValue);
        setMuteButton(!currentValue);
    });
}

configureMuteButton();
