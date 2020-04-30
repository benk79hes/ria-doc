/******************************************************************************
*                                                                             *
*   SNAKE IT !                                                                *
*                                                                             *
*   Fichier principal du jeu Snake It                                         *
*                                                                             *
******************************************************************************/


function Snake(x, y, length)
{
    /**
     * Position de la tête
     */
    this.x = x;
    this.y = y;

    this.trace = [];

    for (let i = 0; i < length; i++) {
        y++;
        this.trace.push({x: x, y: y});
    }

    /**
     * 0: haut
     * 1: droite
     * 2: bas
     * 3: gauche
     */
    var direction = 0; 
    
    var tailleTrace = this.trace.length;
    var sautTrace = 2;
    var tailleMaxTrace = 1000; // Cette valeur sera changé plus tard (enfin, à voir)


    this.setDirection = function(dir) {

        console.log(dir);
        /**
         * Eviter le demi-tour
         */
        if (direction == (dir + 2) % 4)
            return;


        /**
         * Changement de direction
         */

        direction = dir;
    }

    this.move = function(){
        var depX, depY;
        
        switch (direction) {
            case 0:
                depX=0;
                depY=-1;
                break;

            case 1:
                depX=1;
                depY=0;
                break;

            case 2:
                depX=0;
                depY=1;
                break;

            case 3:
                depX=-1;
                depY=0;
                break;
        }

        this.x += depX;
        this.y += depY; 


        /**
         * Gestion du serpent
         */
        // Trace du serpent
        this.trace.unshift({x:this.x,y:this.y});

        // pour augmenter la trace du serpent toutes les X (ici 3) secondes
        /*
        if(tailleTrace <= tailleMaxTrace){
        if((compteBoucle++)%100 == 3){
        sautBoucle-- ;
        if(sautBoucle<0){
        tailleTrace+=sautTrace;
        }
        }
        }
        */

        while (this.trace.length > tailleTrace) {
            // pour enlèver un élément
            this.trace.pop();
        }
    };

    this.eat = function() {
        if (tailleTrace < tailleMaxTrace) {
            tailleTrace += sautTrace;
        }
    }

    this.hasCollision = function() {
        for (var i = 1; i < this.trace.length; i++) {
            if (this.trace[i].x == this.x && this.trace[i].y == this.y){
                return true;
            }
        }
        return false;
    }
}

function Apple(x, y)
{
    this.x = x;
    this.y = y;
}

function deepAssign(o1, o2) {
    for (o in o2) {
        if (typeof o2[o] === 'object' && typeof o1[o] !== 'undefined') {
            deepAssign(o1[o], o2[o]);
        }
        else {
            o1[o] = o2[o];
        }
    }
}


function Game(querySelector, options)
{
    let opts = {
        levelName: 'First level',
        intervalTime:  200,
        addObstacleTimeout: 50,
        obstacles: {
            'apple': 4,
            'teacher': 0,
        }
    };

    //var canvas = document.getElementById("zone");
    var _self = this;
    var canvas = document.querySelector(querySelector);
    var ctx = canvas.getContext('2d');

    var intervalID = null;
    var gridSize = 20
    var gameGridWidth = canvas.width / gridSize;
    var gameGridHeight = canvas.height / gridSize;



    var applesEaten;
    var apples;
    var timeout; 
    var snake;



    // console.log(opts);

    // position sur le canvas
    //var depX = depY = 0;

    // départ serpent au milieu du canvas (utilisé ici)
    //var x = Math.trunc(Math.random() * canvas.width / gridSize) * gridSize;
    //var y = Math.trunc(Math.random() * canvas.height / gridSize) * gridSize;

    // Position "pomme" aléatoire
    // var pomX = Math.trunc(Math.random() * canvas.width/gridSize) * gridSize; ;
    // var pomY = Math.trunc(Math.random() * canvas.height/gridSize) * gridSize;


    this.init = function(options) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); 
        // console.log('init');
        deepAssign(opts, options);
        applesEaten = 0;
        apples = [];
        timeout = 0; 
        snake = new Snake(Math.trunc(gameGridWidth / 2), Math.trunc(gameGridHeight / 2), 3);
        addApple();
    }

    function addApple() {
        let randomX = Math.round(Math.random() * gameGridWidth);
        let randomY = Math.round(Math.random() * gameGridHeight);

        let apple = new Apple(randomX, randomY);
        apples.push(apple);
    }



    this.up = function() {
        snake.setDirection(0);
    };

    this.right = function() {
        snake.setDirection(1);
    }; 

    this.down = function() {
        snake.setDirection(2);
    };

    this.left = function() {
        snake.setDirection(3);
    };

    this.pauseToggle = function() {
        if (intervalID == null) {
            this.start();
        }
        else {
            this.pause();
        }
    };

    this.pause = function() {
        clearInterval(intervalID);
        this.onPause();
        intervalID = null;
    }

    this.start = function() {

        intervalID = setInterval(function() { 
            _self.run();
            _self.draw();
        }, opts.intervalTime);

    };

    this.onGameOver = function(){
        alert('Game over');
    };

    this.onPause = function(){
        //alert('Game on pause. Hit space to continue');
    }
    
    this.onWin = function(score){
        alert('Your score is: ' + score);
    };


    this.run = function() {
        if (applesEaten >= opts.obstacles.apple) {
            this.pause();

            if(this.onWin) {
                this.onWin(applesEaten);
            }
            return;
        }
        
        /**************************************************************************
        *                                                                         *
        *   Dynamique de jeu                                                      *
        *                                                                         *
        **************************************************************************/


        snake.move();


        if (snakeOutOfGrid() || snake.hasCollision()) {
            clearInterval(intervalID);
            console.log(intervalID);
            this.onGameOver();
            return;
        }

        let eating = false;
        apples = apples.filter((apple) => {

            if (snake.x == apple.x && snake.y == apple.y) {

                snake.eat();
                eating = true;
                applesEaten++;
                return false;
            }

            return true;
        });

        if (eating) {
            setTimeout(addApple, 1000);
        }

        if (timeout++ > 1000) {
            timeout = 0 ;
            addApple();
        }
    };

    function snakeOutOfGrid() {
        return  snake.x < 0 || 
                snake.x >= gameGridWidth || 
                snake.y < 0 || 
                snake.y >= gameGridHeight;
    }

    this.draw = function() {
    
        /**
         * Dessiner la base 
         */

        ctx.clearRect(0, 0, canvas.width, canvas.height); 


        /**
         * Dessiner le serpent
         */

        // Tête
        ctx.beginPath();
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(snake.x * gridSize, 
                     snake.y * gridSize, 
                     gridSize, gridSize);
        ctx.closePath();

        // Queue
        ctx.beginPath();
        ctx.fillStyle = "#F1C40F";
        for (var i = 1; i < snake.trace.length; i++) {
            ctx.fillRect(snake.trace[i].x * gridSize, 
                         snake.trace[i].y * gridSize, 
                         gridSize, 
                         gridSize);
        }
        ctx.closePath();


        // Il faut gérer la trace lors de la fonction pause car elle disparaît



        /**
         * Dessiner la pomme 
         * 
         * A mettre dans une boucle pour chaque pomme
         */
        // Affichage de la 2pomme"
        apples.forEach(apple => {
            ctx.beginPath();
            ctx.fillStyle="#FF0000";
            ctx.fillRect(apple.x * gridSize, apple.y * gridSize, gridSize, gridSize);
            ctx.closePath();
        });

    };
    this.init(options);

}


function initKeyboardController(game)
{
    function keyboardEvent(evt) {

        //var timeoutTemp ;
        switch (evt.keyCode) {

            case 37: // touche gauche
            case 65: // touche gauche (a)
                game.left();
                break;

            case 38: // touche haut
            case 87: // touche haut (w)
                game.up();
                break;

            case 39: // touche droite
            case 68: // touche droite (d)
                game.right();
                break;

            case 40: // touche bas
            case 83: // touche bas (s)
            
                game.down();
                break;

            case 32:
                // touche espace pour pause ??
                // Gestion du redémarrage serpent dans la direction où il  allait
                game.pauseToggle();
                break;

        }
    }

    document.addEventListener("keydown", keyboardEvent);
}


