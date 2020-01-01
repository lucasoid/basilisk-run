import blueMorphoSprites from '../assets/butterfly-blue-morpho.png';

const SPEED = 50;
export class Butterfly {
    static handle = 'butterfly';
    static animations = {
        flutter: 'butterfly/flutter',
    };
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
        if (!scene.textures.exists(Butterfly.handle)) {
            scene.load.spritesheet(Butterfly.handle, blueMorphoSprites, {
                frameWidth: 64,
                frameHeight: 44,
            });
        }
    };

    create = () => {
        this.sprite = this.scene.physics.add.sprite(
            this.startX,
            this.startY,
            Butterfly.handle
        );
        this.sprite.setCollideWorldBounds(true);
        this.createAnimations();
        this.sprite.setBounce(0.1);
        this.sprite.body.setAllowGravity(false);
        this.flutter();
    };

    createAnimations = () => {
        this.scene.anims.create({
            key: Butterfly.animations.flutter,
            // frames are 0-index
            frames: this.scene.anims.generateFrameNumbers(Butterfly.handle, {
                start: 0,
                end: 3,
            }),
            frameRate: 10,
            yoyo: true,
            repeat: -1,
            repeatDelay: 200,
        });
    };

    startFluttering = () => {
        const rand = Math.random() > 0.5 ? -1 : 1;
        this.sprite.setVelocityX(rand * SPEED);
        this.sprite.setVelocityY(rand * SPEED);
    };

    flutter = () => {
        this.sprite.anims.play(Butterfly.animations.flutter, true);
    };

    update = () => {
        if (!this.sprite.body) return;

        // hitting a wall
        if (this.sprite.body.blocked.left) {
            this.sprite.setVelocityX(1 * SPEED);
        } else if (this.sprite.body.blocked.right) {
            this.sprite.setVelocityX(-1 * SPEED);
        }
        // hitting the ground
        if (this.sprite.body.blocked.down) {
            this.sprite.setVelocityY(-1 * SPEED);
            // hitting an upper bound
        } else if (
            this.sprite.body.blocked.up ||
            this.sprite.y < this.startY - 300
        ) {
            this.sprite.setVelocityY(1 * SPEED);
        }
    };
}
