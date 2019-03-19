//Version 1.0 - Created. Buggy like a lady bug.
//Version 1.1 - Killed the lady bug (line 158:rot). Made it easier: Killing gives 0-3 ammo instead of 0-2 and reaching a specifc point gives additional life. Made it harder: More zombies and more level.
//Version 2.0 - More zombie feels: background, color, font changed.

//Big thanks to the owner of the images:
//"https://i.pinimg.com/originals/95/ca/f2/95caf2485c9e224a94a059377604c63f.png"
//"https://orig00.deviantart.net/b81a/f/2014/324/f/d/top_down_zombie_walk_by_mmantas-d872eu2.png"
//"http://pixelartmaker.com/art/9d5278583d9297d.png"



var playerImage = new Image();
var enemyImage = new Image();
var bulletImage = new Image();
playerImage.src = "https://i.pinimg.com/originals/95/ca/f2/95caf2485c9e224a94a059377604c63f.png";
enemyImage.src = "https://orig00.deviantart.net/b81a/f/2014/324/f/d/top_down_zombie_walk_by_mmantas-d872eu2.png";
bulletImage.src = "http://pixelartmaker.com/art/9d5278583d9297d.png";

playerImage.onload = function(){
    enemyImage.onload = function(){
        bulletImage.onload = function(){
            start();
        }
    }
}


function start(){

    var width = window.innerWidth;
    var height = window.innerHeight;
    var enemies = [];
    var bullets = [];
    var life = 3;
    var level = 1;
    var ammo = 10;
    var totalEnemies = 0;
    var player = {
        x: width / 2 - 40,
        y: height / 2 - 40,
        width: 80,
        rot: 0,
        img: playerImage,
        draw: function(){
            ctx.save();
            ctx.beginPath();
            ctx.translate(this.x + this.width / 2, this.y + this.width / 2);
            ctx.rotate(Math.PI * this.rot);
            ctx.translate(-(this.x + this.width / 2), -(this.y + this.width / 2));
            ctx.drawImage(this.img, this.x, this.y, this.width, this.width);
            ctx.restore();
        },
    };


    function Enemy(x, y, width, dx, dy, rot, img){
        this.x = x;
        this.y = y;
        this.width = width;
        this.dx = dx;
        this.dy = dy;
        this.rot = rot;
        this.img = img;
    }
    Enemy.prototype.draw = function(){
        ctx.save();
        ctx.beginPath();
        ctx.translate(this.x + this.width / 2, this.y + this.width / 2);
        ctx.rotate(Math.PI * this.rot);
        ctx.translate(-(this.x + this.width / 2), -(this.y + this.width / 2));
        ctx.drawImage(this.img, this.x, this.y, this.width, this.width);
        ctx.restore();
    }

    Enemy.prototype.move = function(){
        this.x += this.dx
        this.y += this.dy
    }

    function Bullet(x, y, width, dx, dy, rot, img){
        this.x = x;
        this.y = y;
        this.width = width;
        this.dx = dx;
        this.dy = dy;
        this.rot = rot;
        this.img = img;
    }
    Bullet.prototype.draw = function(){
        ctx.save();
        ctx.beginPath();
        ctx.translate(this.x + this.width / 2, this.y + this.width / 2);
        ctx.rotate(Math.PI * this.rot);
        ctx.translate(-(this.x + this.width / 2), -(this.y + this.width / 2));
        ctx.drawImage(this.img, this.x, this.y, this.width, this.width);
        ctx.restore();
    }

    Bullet.prototype.move = function(){
        this.x += this.dx
        this.y += this.dy
    }


    function platformDraw(){
        ctx.beginPath();
        ctx.fillStyle = "grey"
        ctx.rect(0, height / 2 - 40, width, 80);
        ctx.rect(width / 2 - 40, 0, 80, height);
        ctx.fill();
        
        
        ctx.beginPath();
        ctx.fillStyle = "brown"
        ctx.rect(0, height / 2 - 25, width, 50);
        ctx.rect(width / 2 - 25, 0, 50, height);
        ctx.fill();
        
        ctx.beginPath();
        ctx.strokeStyle = "red"
        ctx.moveTo(width / 2 - 45, height / 2 - 40);
        ctx.lineTo(width / 2 - 45, height / 2 + 40)
        ctx.moveTo(width / 2 + 45, height / 2 - 40);
        ctx.lineTo(width / 2 + 45, height / 2 + 40);
        ctx.moveTo(width / 2 - 40, height / 2 - 45);
        ctx.lineTo(width / 2 + 40, height / 2 - 45)
        ctx.moveTo(width / 2 - 40, height / 2 + 45);
        ctx.lineTo(width / 2 + 40, height / 2 + 45)
        ctx.stroke();
    }

    function createEnemy(dxdy){
        dxdy = (typeof dxdy !== "undefined") ? dxdy : [[5, 0], [-5, 0], [0, 5], [0, -5]];
        var xy = [[-105, height / 2 - 90,], [width, height / 2 - 90], [width / 2 - 90, -105], [width / 2 - 90, height]];
        var rotate = [0.5, 1.5, 1.0, 0];
        var index = Math.floor(Math.random() * 4);
        
        var x = xy[index][0];
        var y = xy[index][1];
        var dx = dxdy[index][0];
        var dy = dxdy[index][1];
        var rot = rotate[index];
        var img = enemyImage

        
        
        var enemy = new Enemy(x, y, 180, dx, dy, rot, img);
        enemies.push(enemy);
        totalEnemies++;
        
        if(totalEnemies % 20 == 0){
            life ++;
        }
    }

    function createBullet(x, y, dx, dy, rot){
        if(ammo > 0){
        var img = bulletImage;
        var bullet = new Bullet(x, y, 40, dx, dy, rot, img);
        bullets.push(bullet);
        ammo--;
        }
    }

    function ammunate(){
        ammo += Math.floor(Math.random() * 4);
    }

    function enemyMove(){
        for(i = 0; i < enemies.length; i++){
            enemies[i].move();
            enemies[i].draw();
        }
    }

    function bulletMove(){
        for(i = 0; i < bullets.length; i++){
            bullets[i].move();
            bullets[i].draw();
        }
    }

    function collisionDetect(){
        for(var j = 0; j < bullets.length; j++){
            for(var k = 0; k < enemies.length; k++){
            try{
                if(bullets[j].rot == 0 && enemies[k].rot == 0.5 && bullets[j].x < enemies[k].x + 100 && bullets[j].x > enemies[k].x + 0){
                enemies.splice(k, 1);
                bullets.splice(j, 1);
                ammunate();
                }
                else if(bullets[j].rot == 1.0 && enemies[k].rot == 1.5 && bullets[j].x > enemies[k].x + 40 && bullets[j].x < enemies[k].x + 140){
                enemies.splice(k, 1);
                bullets.splice(j, 1);
                ammunate();
                }
                else if(bullets[j].rot == 0.5 && enemies[k].rot == 1.0 && bullets[j].y - 40 > enemies[k].y && bullets[j].y < enemies[k].y + 90){
                enemies.splice(k, 1);
                bullets.splice(j, 1);
                ammunate();
                }
                else if(bullets[j].rot == 1.5 && enemies[k].rot == 0 && bullets[j].y - 40 > enemies[k].y && bullets[j].y < enemies[k].y + 90){
                enemies.splice(k, 1);
                bullets.splice(j, 1);
                ammunate();
                }
            }
            catch(e){
                //Dirty error handling
            }
        }
        }
    }

    function playerCollision(){
        for(var j = 0; j < enemies.length; j++){
            if(enemies[j].rot == 0.5 && enemies[j].x + 100 > player.x){
                enemies.splice(j, 1);
                life --;
            }
            else if(enemies[j].rot == 1.5 && enemies[j].x < player.x){
                enemies.splice(j, 1);
                life --;
            }
            else if(enemies[j].rot == 1.0 && enemies[j].y + 100 > player.y){
                enemies.splice(j, 1);
                life --;
            }
            else if(enemies[j].rot == 0 && enemies[j].y < player.y){
                enemies.splice(j, 1);
                life --;
            }
        }
    }

    function lifeLevel(){
        //level
        if(totalEnemies < 20){
            level = 1;
        }
        else if(totalEnemies < 50){
            level = 2;
        }
        else if(totalEnemies < 90){
            level = 3;
        }
        else if(totalEnemies < 150){
            level = 4;
        }
        else if(totalEnemies < 200){
            level = 5;
        }
        else if(totalEnemies < 300){
            level = 6;
        }
        else{
            level = 7;
        }
        
        ctx.fillStyle = "white";
        ctx.font = "13pt Eater";
        ctx.fillText("Life: " + life, 20, 30);
        ctx.fillText("Ammo: " + ammo, 20, 55);
        ctx.fillText("Level: " + level, width - 115, 30);
        ctx.fillText("Score: " + totalEnemies * 5, width - 115, 55);
    }


    window.onload = function(){
        setTimeout(function(){
            alert("Swipe to shoot. Kill those zombies before they reaches you. Killing zombies gives ammo and reaching specific scores gives additional life. Survive and enjoy. Comment your highest score below.");
        }, 100)
        
        var canvas = document.getElementById("canvas");
        ctx = canvas.getContext("2d");
        canvas.width = width;
        canvas.height = height;
        
        //Initial enemy
        createEnemy();
        
        var frame = setInterval(function(){
            ctx.clearRect(0, 0, width, height);
            platformDraw();
            player.draw();
            enemyMove();
            bulletMove();
            collisionDetect();
            playerCollision();
            lifeLevel();
            if(life < 1){
                alert("You lose. Repeat the game manually.")
                clearInterval(frame);
            }
        }, 51);
        
        
        setInterval(function(){
            createEnemy([[3, 0], [-3, 0], [0, 3], [0, -3]]);
            if(level == 1){
                createEnemy();
            }
            else if(level == 2){
                createEnemy([[8, 0], [-8, 0], [0, 8], [0, -8]]);
            }
            else if(level == 3){
                createEnemy([[10, 0], [-10, 0], [0, 10], [0, -10]]);
            }
            else if(level == 4){
                createEnemy([[13, 0], [-13, 0], [0, 13], [0, -13]]);
            }
            else if(level == 5){
                createEnemy([[15, 0], [-15, 0], [0, 15], [0, -15]]);
            }
            else if(level == 6){
                createEnemy([[15, 0], [-15, 0], [0, 15], [0, -15]]);
                createEnemy();
            }
            else if(level == 7){
                createEnemy();
                createEnemy([[8, 0], [-8, 0], [0, 8], [0, -8]]);
                createEnemy([[10, 0], [-10, 0], [0, 10], [0, -10]]);
                createEnemy([[15, 0], [-15, 0], [0, 15], [0, -15]]);
            }
        }, 1000);
    };



    //Control via swipe
    window.addEventListener("touchstart", function(e){
        e.preventDefault();
        window.startX = e.touches[0].clientX;
        window.startY = e.touches[0].clientY;
    });

    window.addEventListener("touchend", function(e){
        window.endX = e.changedTouches[0].clientX;
        window.endY = e.changedTouches[0].clientY;
        handleTouch();
    });

    function handleTouch(){
        var xDist = endX - startX;
        var yDist = endY - startY;
        
        if(Math.abs(xDist) > Math.abs(yDist)){
            if(xDist > 0){
                player.rot = 0;
                createBullet(width / 2 - 5, height / 2 - 5, 15, 0, 1);
            }
            else{
                player.rot = 1.0;
                createBullet(width / 2 - 40, height / 2 - 35, -15, 0, 0);
            }
        }
        else if(Math.abs(xDist) < Math.abs(yDist)){
            if(yDist < 0){
                player.rot = 1.5;
                createBullet(width / 2 - 5, height / 2 - 35, 0, -15, 0.5);
            }
            else{
                player.rot = 0.5;
                createBullet(width / 2 - 35, height / 2, 0, 15, 1.5);
            }
        }
    }

    //Control via keyboard
    window.addEventListener("keydown", function(e){
    if(e.keyCode == 39){
        player.rot = 0;
        createBullet(width / 2 - 5, height / 2 - 5, 15, 0, 1);
    }
    else if(e.keyCode == 37){
        player.rot = 1.0;
        createBullet(width / 2 - 40, height / 2 - 35, -15, 0, 0);
    }
    else if(e.keyCode == 40){
        player.rot = 0.5;
        createBullet(width / 2 - 35, height / 2, 0, 15, 1.5);
    }
    else if(e.keyCode == 38){
        player.rot = 1.5;
        createBullet(width / 2 - 5, height / 2 - 35, 0, -15, 0.5);
    }
    })
}