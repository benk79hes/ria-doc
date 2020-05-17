/******************************************************************************
*                                                                             *
*   SNAKE IT !                                                                *
*                                                                             *
*   Fichier principal du jeu Snake It                                         *
*                                                                             *
******************************************************************************/


window.onload = function() {
    let game = new Game('#zone');
    initKeyboardController(game);
    game.start();
}

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
    let direction = 0; 
    
    let tailleTrace = this.trace.length;
    let sautTrace = 2;
    let tailleMaxTrace = 1000; // Cette valeur sera changé plus tard (enfin, à voir)


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
        let depX, depY;
        
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


function Game(querySelector)
{
    //var canvas = document.getElementById("zone");
    let _self = this;
    let canvas = document.querySelector(querySelector);
    let ctx = canvas.getContext('2d');

    let intervalID = null;
    let intervalTime = 150;
    let gridSize = 20

    let timeout = 0;
    let gameTimeout = 0;

    // position sur le canvas
    //var depX = depY = 0;
    let gameGridWidth = canvas.width / gridSize;
    let gameGridHeight = canvas.height / gridSize;

    let snake = new Snake(Math.trunc(gameGridWidth / 2), Math.trunc(gameGridHeight / 2), 3);
    // départ serpent au milieu du canvas (utilisé ici)
    //var x = Math.trunc(Math.random() * canvas.width / gridSize) * gridSize;
    //var y = Math.trunc(Math.random() * canvas.height / gridSize) * gridSize;

    let apples = [];
    // Position "pomme" aléatoire
    // var pomX = Math.trunc(Math.random() * canvas.width/gridSize) * gridSize; ;
    // var pomY = Math.trunc(Math.random() * canvas.height/gridSize) * gridSize;


    addApple();
    function _init() {
        ctx.fillStyle="#F1C40F";
        ctx.fillRect(x, y, gridSize, gridSize);
    }
    
    function placeApple () {
        
        let randomX = Math.round(Math.random() * gameGridWidth);
        let randomY = Math.round(Math.random() * gameGridHeight);
        const coordanteApple = [randomX,randomY];
        let test1 = false ;
        let test2 = false ;
        
        while (test1 == false && test2 == false) {
            
            if (randomX != snake.x && randomY != snake.y) {           
                test1 = true ;
            }

            for (let j=1; j < snake.trace.length; j++) {
                if ( (randomX != snake.trace[j].x && randomY != snake.trace[j].y)) {                
                    test2 = true ;               
                } 
            }
            randomX = Math.round(Math.random() * gameGridWidth);
            randomY = Math.round(Math.random() * gameGridHeight);
        }
        
        return coordanteApple;
    }
    
    function addApple() {
        
        let coordonnateApple = placeApple();
        
        let apple = new Apple(coordonnateApple[0], coordonnateApple[1]);
        
        apples.push(apple);
    }

    function moveApple (end, timeout, apples, eating) {
        let coordonnateApple = placeApple();
        let timer = 50 ;
        
        do {
            ctx.beginPath();
            ctx.fillStyle="#FFFFFF";
            ctx.fillRect(apples[apples.length].x * gridSize, apples[apples.length].y * gridSize, gridSize, gridSize);
            ctx.closePath();
        } while (timeout > end)
        
        if (eating) {
            return ;
        }
        
        apples.pop();
        addApple();
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

    this.pause = function() {
        if (intervalID == null) {
            this.start();
        }
        else {
            clearInterval(intervalID);
            intervalID = null;
        }
    };

    this.start = function() {

        intervalID = setInterval(function() { 
            _self.run();
            _self.draw();
        }, intervalTime);

    };


    this.run = function() {
        
        /**************************************************************************
        *                                                                         *
        *   Dynamique de jeu                                                      *
        *                                                                         *
        **************************************************************************/


        snake.move();


        if (snakeOutOfGrid() || snake.hasCollision()) {
            clearInterval(intervalID);
            alert('game over');
            return;
        }

        let eating = false;
        apples = apples.filter((apple) => {

            if (snake.x == apple.x && snake.y == apple.y) {

                snake.eat();
                eating = true;
                return false;
            }

            return true;
        });

        if (eating) {
            setTimeout(addApple, 1000);
        }
        
 /*       if(timeout++ >150){
            if(timeout %4 == 0 ) {
                apple;
            }

         }
*/
            // On positionne la pomme ailleurs au bout d'un certain temps
        if(timeout++ > 150){
            moveApple (200, timeout, apples, eating);
            timeout = 0 ;            
         }
        
        if (timeout++ > 10000) {
            timeout = 0 ;
            addApple();
        }
    };

    function snakeOutOfGrid() {
        return  snake.x < 0 || 
                snake.x == gameGridWidth || 
                snake.y < 0 || 
                snake.y == gameGridHeight;
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
                game.pause();
                break;

        }
    }

    document.addEventListener("keydown", keyboardEvent);
}


