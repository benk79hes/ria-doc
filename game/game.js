/******************************************************************************
*                                                                             *
*   SNAKE IT !                                                                *
*                                                                             *
*   Fichier principal du jeu Snake It                                         *
*                                                                             *
******************************************************************************/



/**************************** Objet Apple ***************************/




function Game(querySelector, options, scoreTot)
{

    var canvas = document.querySelector(querySelector);

    let opts = {
        levelName: 'First level',
        intervalTime:  300,
        addObstacleTimeout: 500,
        obstacles: {
            'apple': 1,
            'teacher':4,
        }
    };
    var ctx = canvas.getContext('2d');

    var eatSound = document.getElementById('eatSound'); //!!!!!!!!MUSIC IS HERE

    
    var intervalID = null;
    var gridSize = 20


    var applesTotProd;    
    var applesEaten;
    var apples;

    var obstacles;
    var apple;
    var obstacleLength;
    
    var applesExtraTime;
    
    let timeout =0; 
    let elapseTime = 0;
    let beginingLevelTime = Date.now ();
    let endLevelTime;
    let scoreLevel = 0;
    let noEatenApple;
    let applesBonus = 0;

    let backToWork = false;

    var _self = this;

    _self.gameGridWidth = canvas.width / gridSize;
    _self.gameGridHeight = canvas.height / gridSize;
    _self.snake = null;

    this.init = function(options, resetScore) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); 

        deepAssign(opts, options);
        elapseTime = 0;
        applesTotProd = 0;
        applesEaten = 0;
        applesBonus = 0;
        apples = [];
        applesExtraTime = [];
        timeout = 0;
        scoreLevel = 0;
        noEatenApple = opts.obstacles.apple;
        
        if (resetScore) {
            scoreTot = 0;
        }

        console.log('opts', opts);
        console.log('applesEaten', applesEaten);

        _self.snake = new Snake(Math.trunc(_self.gameGridWidth / 2), Math.trunc(_self.gameGridHeight / 2), 3);
        addApple(apples);    
    };

    

    /**************************** Fonctions  Ajout Apple ***************************/ 
    
    function addApple(table) {
        let apple;

        /**
         * Détermination place Apple 
         */   
        let randomX = Math.trunc(Math.random() * (_self.gameGridWidth-1));
        let randomY = Math.trunc(Math.random() * (_self.gameGridHeight-1));
        
        while (!testPosition(randomX, randomY)) {
            
            randomX = Math.round(Math.random() * (_self.gameGridWidth-1));
            randomY = Math.round(Math.random() * (_self.gameGridHeight-1));
        }
        
        apple = new Apple(randomX, randomY, _self);        
        elapseTime = Date.now () - beginingLevelTime;

        table.push(apple);
        applesTotProd++;

    }
 


    /**************************************************************************
     * Commandes du jeu (keyboard, touch, voice, etc)                         *
     *************************************************************************/

    this.up = function() {
        _self.snake.setDirection(0);
    };

    this.right = function() {
        _self.snake.setDirection(1);
    }; 

    this.down = function() {
        _self.snake.setDirection(2);
    };

    this.left = function() {
        _self.snake.setDirection(3);
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
    };


    /**************************************************************************
     * Events du jeu, fonctions à redéfinir à l'extérieur                     *
     *************************************************************************/

    this.onWin = function(score){};

    this.onGameOver = function(){};

    this.onPause = function(){};


    this.calcScore = function () {
        
        let playerTimeResult;
        
        let bestTimeResult = applesTotProd * 50000 /* faire variable pour */;     
        
        if (backToWork == true) {
            playerTimeResult = elapseTime + endLevelTime - beginingLevelTime;
        }else {
            playerTimeResult = endLevelTime - beginingLevelTime;
        }
    
        let playerQuote = bestTimeResult / playerTimeResult ;
        let bonus = ~~(playerQuote * (scoreLevel));
        

        if (playerQuote < 0.2) {
            
            bonus = 0;
        }

        return (scoreLevel + bonus);  
    };

    this.start = function() {
                
        intervalID = setInterval(function() { 
 
            if(_self.run()) {
                _self.draw();
            }
            
        }, opts.intervalTime);

    };
    
    
    this.run = function() {     
        
        if (applesEaten >= opts.obstacles.apple) {
            this.pause();

            endLevelTime = Date.now ();
            scoreTot += this.calcScore();

            this.onWin(scoreTot);
            
            return false;
        }
        



        /**************************************************************************
        *                                                                         *
        *   Dynamique de jeu                                                      *
        *                                                                         *
        **************************************************************************/
      
        // Mise en mouvement du serpent
        _self.snake.move();
 
        // Mise en mouvement de la pomme
        if (apples.length > 0) {
            apples.forEach(apple => {
                if( apple.noSnakeCollision() ){
                    apple.stopApple();
                }
                else {
                    apple.moveApple();
                }
            }, 100);

        }
            
        if (snakeOutOfGrid() || _self.snake.hasCollision()) {
            clearInterval(intervalID);
            this.init(options);
            this.onGameOver();
            return false;
        }

        let eating = false;
        let eatSoundFlag = true;
        apples = apples.filter((apple) => {
          
            if (_self.snake.x == apple.x && _self.snake.y == apple.y) {

                _self.snake.eat();
                eating = true;
                applesEaten++;
                noEatenApple--;
                scoreLevel+=10;

                if (eatSoundFlag) {               //!!!!!!!!MUSIC IS HERE
                    eatSound.pause();
                    eatSound.currentTime = 0;
                    eatSound.play();
                    eatSoundFlag=false;         
                }

                return false;
            }

            return true;
        });

        applesExtraTime = applesExtraTime.filter((apple) => {
            
            if (_self.snake.x == apple.x && _self.snake.y == apple.y) {

                _self.snake.eat();
                eating = true;
                scoreLevel+=5;
                applesBonus++;
                return false;
            }

            return true;
        });

        if (eating && applesEaten < opts.obstacles.apple && apples.length < opts.obstacles.apple) {
            
            setTimeout(addApple(apples), 1000);
        
        }

       
        if (timeout++ > opts.addObstacleTimeout && opts.teacher > 0 ) {
            timeout = 0 ;
            opts.teacher--;
            addApple(applesExtraTime);
        }
console.log(timeout);
        return true;
    };

    function snakeOutOfGrid() {
        return  _self.snake.x < 0 || 
                _self.snake.x >= _self.gameGridWidth || 
                _self.snake.y < 0 || 
                _self.snake.y >= _self.gameGridHeight;
    }

    

    // Méthode test la position d'un objet par rapport au serpent
    function testPosition (x, y) 
    {     

        /**
         * Test de la tête
         */
        if (x == _self.snake.x && y == _self.snake.y) {
            return false ;
        }

        /**
         * Test de la queue
         */
        for (let i=0; i < _self.snake.trace.length; i++) {
            let point = _self.snake.trace[i];

            if (x == point.x && y == point.y) {
                return false ;
            }
        }
        
        return true;
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
        ctx.fillRect(_self.snake.x * gridSize, 
                     _self.snake.y * gridSize, 
                     gridSize, gridSize);
        ctx.closePath();

        // Queue
        ctx.beginPath();
        ctx.fillStyle = "#F1C40F";
        for (var i = 1; i < _self.snake.trace.length; i++) {
            ctx.fillRect(_self.snake.trace[i].x * gridSize, 
                         _self.snake.trace[i].y * gridSize, 
                         gridSize, 
                         gridSize);
        }
        ctx.closePath();

        /**
        * Editer le score
        **/
         // Affichage du score
         ctx.font = '16px Arial';
         ctx.fillStyle = '#fff';
         ctx.fillText('Score: ' + scoreTot, 5, 20);
        
        /**
        * Editer le nombre de pomme
        **/
        // Affichage du score
        ctx.font = '16px Arial';
        ctx.fillStyle = '#fff';
        ctx.fillText('To win level you have eat : ' + noEatenApple + ' red apple', 500, 20);
        
        /**
        * Editer le nombre de pomme(s) bonus mangée(s)
        **/
        // Affichage du score
        ctx.font = '16px Arial';
        ctx.fillStyle = '#fff';
        ctx.fillText('Apple bonus (blue) eaten : ' + applesBonus, 500, 50);
        

        /**
         * Dessiner la pomme 
         * 
         * A mettre dans une boucle pour chaque pomme
         */
        apples.forEach(apple => {
            ctx.beginPath();
            ctx.fillStyle="#FF0000";
            ctx.fillRect(apple.x * gridSize, apple.y * gridSize, gridSize, gridSize);
            ctx.closePath();
        }, 40);
        
        applesExtraTime.forEach(apple => {
            ctx.beginPath();
    //        ctx.fillStyle="blue";
            var imgProf = new Image();
            
            imgProf.src = 'Images/' + (~~(Math.random()*3)+1).toString + '.jpg';
            
            imgProf.onload = function(){
                ctx.drawImage(imgProf, apple.x * gridSize, apple.y * gridSize);
            }
            
//            ctx.fillRect(apple.x * gridSize, apple.y * gridSize, gridSize, gridSize);
            ctx.closePath();
        }, 40);
      
    };


    this.init(options);
}

