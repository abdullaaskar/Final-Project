class Level1 extends Phaser.Scene {
    constructor() {
        super("level1Scene");
    }

    preload(){
        this.load.image('color', './assets/level1/color.png');
        this.load.image('bg3', './assets/level1/basicBack2.png');
        this.load.image('door','./assets/level1/beer.png');
        this.load.audio('choco','./assets/sound/BGM.mp3');
        this.load.audio('walk', './assets/sound/Walk.mp3');
        this.load.audio('jump', './assets/sound/Jump.mp3');
        this.load.audio('levelup', './assets/sound/LevelUp.mp3');
        this.load.audio('bounce', './assets/sound/Bounce.mp3');

    }

    create() {

        this.bgm = this.sound.add('choco',{
            mute : false,
            volume : 0.5,
            rate : 3,
            loop : true
        });
        
        this.sound.play('choco');
        // variables and settings
        this.ACCELERATION = 500;
        this.MAX_X_VEL = 600;   // pixels/second
        this.MAX_Y_VEL = 3000;
        this.DRAG = 5000;    // DRAG < ACCELERATION = icy slide
        this.JUMP_VELOCITY = -1000;
        this.physics.world.gravity.y = 3500;

        // set bg
        // this.cameras.main.setBackgroundColor("#227B96");
        this.mainBack = this.add.tileSprite(0, 0, 640, 480, 'bg1').setOrigin(0, 0);

        // print Scene name
        this.add.text(game.config.width / 2, 30, 'level1', { font: '14px Futura', fill: '#32CD32' }).setOrigin(0.5);

        // make ground tiles group
        this.ground = this.add.group();
        // 小方块（顺序：从上往下)
        // 地面
        for (let i = 467; i < game.config.width; i += tileSize) {
            let groundTile1 = this.physics.add.sprite(i, game.config.height - tileSize*4).setScale(SCALE).setOrigin(0);
            let groundTile2 = this.physics.add.sprite(i, game.config.height - tileSize*3).setScale(SCALE).setOrigin(0);
            groundTile1.body.immovable = true;
            groundTile1.body.allowGravity = false;
            groundTile2.body.immovable = true;
            groundTile2.body.allowGravity = false;
            this.ground.add(groundTile1);
            this.ground.add(groundTile2);
        }
        for (let i = 0; i < game.config.width - tileSize * 20; i += tileSize) {
            let groundTile = this.physics.add.sprite(i, game.config.height - tileSize*5).setScale(SCALE).setOrigin(0);
            let groundTile1 = this.physics.add.sprite(i, game.config.height - tileSize*4).setScale(SCALE).setOrigin(0);
            let groundTile2 = this.physics.add.sprite(i, game.config.height - tileSize*3).setScale(SCALE).setOrigin(0);
            groundTile.body.immovable = true;
            groundTile.body.allowGravity = false;
            groundTile1.body.immovable = true;
            groundTile1.body.allowGravity = false;
            groundTile2.body.immovable = true;
            groundTile2.body.allowGravity = false;
            this.ground.add(groundTile);
            this.ground.add(groundTile1);
            this.ground.add(groundTile2);
        }
        for (let i = 0; i < game.config.width; i += tileSize) {
            let groundTile1 = this.physics.add.sprite(i, game.config.height - tileSize*2).setScale(SCALE).setOrigin(0);
            let groundTile2 = this.physics.add.sprite(i, game.config.height - tileSize).setScale(SCALE).setOrigin(0);
            groundTile1.body.immovable = true;
            groundTile1.body.allowGravity = false;
            groundTile2.body.immovable = true;
            groundTile2.body.allowGravity = false;
            this.ground.add(groundTile1);
            this.ground.add(groundTile2);
        }


        // set up robot
        this.robot = this.physics.add.sprite(game.config.width / 2, game.config.height / 2, 'player').setScale(SCALE);
        this.robot.setMaxVelocity(this.MAX_X_VEL, this.MAX_Y_VEL);
        this.robot.setCollideWorldBounds(true);
        this.robot.setDepth(99999);

        //色块
        this.color = new Color(this, 423, 398, 'color').setOrigin(0, 0);
        this.color.setDepth(99999);

        //门
        this.door = new Door(this, 580, 349, 'door').setOrigin(0, 0);
        this.door.setDepth(99999);
        

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();
        // keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        // add physics collider
        this.physics.add.collider(this.robot, this.ground);

        this.gameOver = false;
        this.door.alpha = 0;

        // 快速切换关卡 方便测试
        this.input.keyboard.on('keydown', (event) => {
            switch (event.key) {
                case '1':
                    this.scene.start("level1Scene");
                    break;
                case '2':
                    this.scene.start("level2Scene");
                    break;
                default:
                    break;
            }
        });

    }

    update() {

        this.robot.update();         // update player sprite
        this.color.update();
        this.door.update();           // update obstacles

        // check collisions
        if (this.checkCollision(this.robot, this.color)) {
            this.colorExplode(this.color); 
            this.door.alpha = 1;
            // this.robotExplode(this.robot.x,this.robot.y);
        }

        if (this.checkCollision(this.robot, this.door)) {
            this.doorExplode(this.door); 
            // this.robotExplode(this.robot.x,this.robot.y);
        }

        // check keyboard input
        if (cursors.left.isDown) {
            this.robot.body.setAccelerationX(-this.ACCELERATION);
            // this.sound.play('walk');
            this.robot.body.setBounceX(1);
            this.robot.setFlip(true, false);
            // see: https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Components.Animation.html#play__anchor
            // play(key [, ignoreIfPlaying] [, startFrame])
            //this.robot.anims.play('walk', true);
        } else if (cursors.right.isDown) {
            this.robot.body.setAccelerationX(this.ACCELERATION);
            // this.sound.play('walk');
            this.robot.body.setBounceX(1);

            this.robot.resetFlip();
            //this.robot.anims.play('walk', true);
        } else {
            // set acceleration to 0 so DRAG will take over
            this.robot.body.setAccelerationX(0);
            this.robot.body.setDragX(this.DRAG);
            
            //this.robot.anims.play('idle');
        }

        // jump
        // use JustDown to avoid "pogo" jumps if you player keeps the up key held down
        // note: there is unfortunately no .justDown property in Phaser's cursor object
        if (this.robot.body.touching.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            this.robot.body.setVelocityY(this.JUMP_VELOCITY);
            this.sound.play('jump');
        }


        // wrap physics object(s) .wrap(gameObject, padding)
        this.physics.world.wrap(this.robot, this.robot.width / 2);
    }

    checkCollision(robot, obstacle) {
        // simple AABB checking
        if (robot.x < obstacle.x + obstacle.width &&
            robot.x + robot.width > obstacle.x &&
            robot.y < obstacle.y + obstacle.height &&
            robot.height + robot.y > obstacle.y) {
            return true;
        } else {
            return false;
        }
    }

        //障碍物爆炸
    colorExplode(obstacle){
        //temporarily hide obstacle
        obstacle.alpha = 0;
        this.mainBack = this.add.tileSprite(0, 0, 640, 480, 'bg3').setOrigin(0, 0);
        
    }

    doorExplode(obstacle){
        obstacle.alpha = 0;
        this.sound.play('levelup');
        this.scene.start('level2Scene');
        
    }
}