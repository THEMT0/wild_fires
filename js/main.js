window.onload = function() {
    
    //Borrowed assets as followed:
    //Grass sprite: Pokemon Gold screenshot
    //Firefighter: http://vincebetteridge.com/firefighter/player.png 40x30
    
    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update} );
    
    var background;
    var player;
    var fires = [];
    var i;
    
    function preload() {
        game.load.image( 'grass', 'assets/grass.png' );
        game.load.spritesheet( 'firefighter', 'assets/firefighter.png', 40, 30);
        game.load.spritesheet( 'fire', 'assets/fire2.png', 50 , 50);
    }

    function create() {
        background = game.add.tileSprite(0, 0, 800, 600, 'grass'); 
        
        //attempting to add player sprite, animations, and collisions
        player = game.add.sprite(game.world.centerX, game.world.centerY, 'firefighter');
        
        player.animations.add('idleRight', [88, 89, 90, 91], 8, true, true);
        player.animations.add('idleLeft', [92, 93, 94, 95], 8, true, true);
        player.animations.add('runRight', [0, 1, 2, 3, 4, 5, 6, 7], 20, true, true);
        player.animations.add('runLeft', [32, 33, 34, 35, 36, 37, 38, 39], 20, true, true);
        
        game.physics.enable(player, Phaser.Physics.ARCADE);
        player.body.setSize(16, 26, 12, 4);
        player.body.collideWorldBounds = true;
        
        //Creating initial fire
        fires[0] = new fire(game.world.randomX % 600 + 100, game.world.randomY % 400 + 100);
        game.physics.enable(fires[0], Phaser.Physics.ARCADE);
        
        fires = game.add.group();
        
        //starting animations
        player.animations.play('idleRight');
        fires[0].sprite.animations.play('burning');
        
        //no more page scrolling from keys
        this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR, Phaser.Keyboard.UP, Phaser.Keyboard.DOWN, Phaser.Keyboard.RIGHT, Phaser.Keyboard.LEFT]);
        
        var t;
    }
    
    function fire(x, y){
        this.sprite = game.add.sprite(x, y, 'fire');
        this.sprite.animations.add('burning', [0, 1, 2, 3, 4], 8, true, true);
        this.timer = 0;
    };
    
    function render(){
        //game.debug.text('fires.length = ' + fires.length + '\nfires[0].timer = ' + fires[0].timer + "\ni = " + i, 20);
        
    }
    
    function update() {
        
        //game.physics.arcade.collide(player, fire, collisionHandler, null, this);
        moveChar();
        
        //console.log("fires.length = " + fires.length + "\nfires[0].timer = " + fires[0].timer);
            
        for(i = 0; i <= fires.length - 1; i++) {
            spreadFire(i);
        }
    }
    
    function moveChar () {
        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
        {
            player.x -= 4;
            player.animations.play('runLeft');
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
        {
            player.x += 4;
            player.animations.play('runRight');
        }

        else if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
        {
            player.y -= 4;
            player.animations.play('runLeft');
        }
        
        else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
        {
            player.y += 4;
            player.animations.play('runRight');
        }
    }
    
    function spreadFire(i) {
        fires[i].timer++;
        
        if(fires[i].timer == 180) {
            var rX = Math.random();
            var rY = Math.random();
            
            if(rX < 0.5)
               if(rY < 0.5) {rX = -1.01; rY = 0;}
                
                else {rX = 1.01; rY = 0;}
            
            else if(rX >= 0.5)
                if(rY < 0.5){rX = 0; rY = -1.01;}
            
                else {rX = 0; rY = 1.01}
            
            fires[fires.length] = new fire((fires[i].sprite.x + 50 * rX), (fires[i].sprite.y + 50 * rY));
            game.physics.enable(fires[fires.length - 1], Phaser.Physics.ARCADE);
            fires[fires.length - 1].sprite.animations.play('burning');
            fires[i].timer = 0;
            
            for(var k = 0; k <= fires.length - 1; k++) {
                overlap(fires[k], fires[fires.length - 1], k);
            }
        }
    }
    
    function overlap(oldFire, newFire, j) {
//        if((newFire.sprite.x >= oldFire.x && newFire.sprite.x <= oldFire.x + 49) && (newFire.sprite.y >= oldFire.sprite.y && newFire.sprite.y <= oldFire.sprite.y + 49)) {
        console.log(oldFire, newFire);
        var test = (game.physics.arcade.collide(oldFire.sprite, newFire.sprite))
        
        if(test){
            fires[fires.length - 1].sprite.destroy();
            fires.splice(fires.length - 1, 1);
            console.log("Somebody dead yo");
        }
    }
    
    function fireHandler (obj1, obj2) {
        
    }
    
};