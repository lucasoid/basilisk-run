import beetleImg from '../assets/beetle.png';

const SPEED = 100;
export class Beetle {
    scene;
    player;
    sprite;
    startX = 0;
    startY = 0;

    constructor(scene, player) {
        this.scene = scene;
        this.player = player;
    }

    static preload = scene => {
        scene.load.image('beetle', beetleImg);
    };

    create = () => {
        this.sprite = this.scene.physics.add.sprite(
            this.startX,
            this.startY,
            'beetle'
        );
        this.sprite.setCollideWorldBounds(true);
        this.sprite.setBounce(0.1);
    };

    runLeft = () => {
        this.sprite.setVelocityX(-1 * SPEED);
    };

    runRight = () => {
        this.sprite.setVelocityX(1 * SPEED);
    };

    rest = () => {
        this.sprite.setVelocity(0);
    };

    update = () => {
        if (!this.sprite.body) return;
        // the lizard approacheth
        const safeDistance = 400;
        if (
            Math.abs(this.player.sprite.x - this.sprite.x) < safeDistance &&
            Math.abs(this.player.sprite.y - this.sprite.y) < safeDistance
        ) {
            if (this.player.sprite.x > this.sprite.x) {
                this.runLeft();
            } else {
                this.runRight();
            }
        }
        // hitting a wall
        else if (this.sprite.body.blocked.left) {
            this.runRight();
        } else if (this.sprite.body.blocked.right) {
            this.runLeft();
        } else {
            if (this.sprite.body.velocity.x !== 0) {
                this.rest();
            }
        }
    };
}
