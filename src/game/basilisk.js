export const KEY = 'basilisk';
import basiliskSprites from './assets/basilisk-sprites.png';

export const animations = {
    LEFT: 'left',
    RIGHT: 'right',
};

export const loadSpritesheet = game => {
    game.load.spritesheet(KEY, basiliskSprites, {
        frameWidth: 250,
        frameHeight: 137.33,
    });
};

export const registerAnimations = game => {
    game.anims.create({
        key: animations.LEFT,
        // frames are 0-index
        frames: game.anims.generateFrameNumbers(KEY, { start: 11, end: 8 }),
        frameRate: 10,
        repeat: -1,
    });

    game.anims.create({
        key: animations.RIGHT,
        frames: game.anims.generateFrameNumbers(KEY, { start: 4, end: 7 }),
        frameRate: 10,
        repeat: -1,
    });
};

export const listenForUpdates = (game, player) => {
    const cursors = game.input.keyboard.createCursorKeys();

    if (cursors.left.isDown) {
        player.setVelocityX(-400);
        player.anims.play(animations.LEFT, true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(400);
        player.anims.play(animations.RIGHT, true);
    } else if (player.body.touching.down) {
        // stop all animations
        player.anims.stop(null);
        // set the resting frame to either left or right
        if (player.body.velocity.x < 0) {
            player.setFrame(1);
        } else if (player.body.velocity.x > 0) {
            player.setFrame(0);
        }
        // stop moving
        player.setVelocityX(0);
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-300);
    }
};
