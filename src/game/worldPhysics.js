let timer = null;
let jesusMode = true;
const JESUS_MODE_LENGTH = 2000;

const startJesusMode = () => {
    timer = setTimeout(() => {
        jesusMode = false;
    }, JESUS_MODE_LENGTH);
};

const resetJesusMode = () => {
    clearTimeout(timer);
    timer = null;
    jesusMode = true;
};

export const create = (game, player, { ground, water }) => {
    game.physics.add.collider(
        player,
        ground,
        () => {
            if (!jesusMode) resetJesusMode();
        },
        null
    );
    game.physics.add.collider(
        player,
        water,
        () => {
            if (timer === null) startJesusMode();
        },
        () => {
            return player.body.velocity.x != 0 && jesusMode;
        }
    );
};
