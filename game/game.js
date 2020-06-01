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
    this.direction = 0; 
    
    var tailleTrace = this.trace.length;
    var sautTrace = 2;
    var tailleMaxTrace = 1500; // Cette valeur sera changé plus tard (enfin, à voir)


    this.setDirection = function(dir) {

        /**
         * Eviter le demi-tour
         */
        if (this.direction == (dir + 2) % 4)
            return;


        /**
         * Changement de direction
         */

        this.direction = dir;
    };

    this.move = function(){
        var depX, depY;
        
        switch (this.direction) {
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

        while (this.trace.length > tailleTrace) {
            // pour enlèver un élément
            this.trace.pop();
        }
    };

    this.eat = function() {
        if (tailleTrace < tailleMaxTrace) {
            tailleTrace += sautTrace;
        }
    };

    this.hasCollision = function() {
        for (var i = 1; i < this.trace.length; i++) {
            if (this.trace[i].x == this.x && this.trace[i].y == this.y){
                return true;
            }
        }
        return false;
    };
}


/**************************** Objet Obstacle ***************************/

function Obstacle (x, y, obstacleLength, dirMur, snake, canvas)
{
    this.x = x;
    this.y = y;
    this.length = obstacleLength;
    this.long = [];
    for (let i = 0; i < this.length; i++) {
        y++;
        this.long.push({x: x, y: y});
    }
    
}


function Door(x, y, dirMur, snake, canvas) 
{
    this.x = x;
    this.y = y;
    let length = 3;
    this.longDoor = [];
    
    for (let i = 0; i <length; i++) {
        y++;
        this.longDoor.push({x: x, y: y});
        this.longDoor.push({x: x+1, y: y});

    }
    
    
    entry = function (xMove, yMove) {
      
        if ((xMove + 1) == this.x && (yMove + 1) == (this.y+1) ) {
            return true;
        }
        
        return false;
    };
    
}


/**************************** Objet Apple ***************************/

function Apple(x, y, snake, canvas)
{
    this.x = x;
    this.y = y;

    snake = snake;    
    canvas = canvas;
    
    this.depDirection;
    let depApple = [0,0];
    let moveAlea;
    let testgridBounds = [false /*haut*/, false /*bas*/, false /*gauche*/, false /*droite*/];
    let tabDirectionInit = ["Freez", "Up", "Down", "Left", "Right"];
    let tabDirection = tabDirectionInit;
    let choiceDirection;  //String
    let choiceMove;   //int
    
    let timeAppleRegular = 10;
    
    // Méthode pour créer le déplacement aléatoire
    this.randomMove = function () {
        
        choiceMove = Math.round(Math.random()*4);                    
        choiceDirection = tabDirection [choiceMove];
        
        while (choiceDirection == null){
            
            choiceMove = Math.round(Math.random()*4);                    
            choiceDirection = tabDirection [choiceMove];
            
        } 
        
        tabDirection = tabDirectionInit;  
        
        return choiceDirection;  // String
    };
    
    // Méthode pour valider déplacement aléatoire
    this.testPossiblMove = function () {
                       
        let snakeDirection ; 
        
        snakeDirection = snake.direction;
        
        if (snakeDirection == undefined) {
            snakeDirection = Math.round(Math.random()*3);
        }

        
        // déplacement impossible en fonction des limites de la grille
        if (this.outOfGridApple("lat", -1)){
           tabDirection [1] = null; 
        }       
        if (this.outOfGridApple("lat", 1)){
            tabDirection [2] = null;
        }
        if (this.outOfGridApple("lon", -1)){
            tabDirection [3] = null;
        }
        if (this.outOfGridApple("lon", 1)){
            tabDirection [4] = null;
        }

        
        // déplacement impossible en fonction du snake
        switch(snakeDirection) {
            case 0: //serpent qui monte
                if (this.x == snake.x && (this.y + 1) <= snake.y) {
 
                    tabDirection [1] = null;
                }
               break;

            case 1: // serpent qui va à droite
                if (this.y == snake.y && (this.x -1) >= snake.x) {

                    tabDirection [3] = null;
                }
               break; 

            case 2: // serpent qui descend
                if (this.x == snake.x && (this.y -1) >= snake.y) {

                    tabDirection [2] = null;                      
                }                   
                break; 

            case 3: // serpent qui va à gauche
                if (this.y == snake.y && (this.x +1) <= snake.y) {

                    tabDirection [4] = null;
                }                  
                break; 

        }
               
        // détermination du "déplacement" à faire réellement
        this.depDirection = this.randomMove ();
        
    
        if (this.depDirection == undefined) {
            this.depDirection = "Up";
        }
  
    };

    // Méthode déplacement de Apple
    this.moveApple = function () {

        let checkTime = new Date();
        
        timeAppleRegular --;
           
        if (timeAppleRegular == 0 || this.depDirection == undefined) {
            this.testPossiblMove();
            timeAppleRegular = 10;
        }

 
        if (this.depDirection == undefined) {
            
            this.depDirection = tabDirection [Math.trunc(Math.random()*4)];  
        }
       
        switch (this.depDirection) {
            case "Up" :
                depApple = [0, -1];
                break ;
                
            case "Down" :  
                depApple = [0, 1];
                break ;
                
            case "Left" :
                depApple = [-1, 0];
                break ;
                
            case "Right" :
                depApple = [1, 0];
                break ;
                
            default :
                depApple = [0, 0];
                break ;
        }
          
            this.testMoveApple();      
            this.x += depApple[0];
            this.y += depApple[1];          
        
    };
  
   // Méthode teste déplacement de la pomme si Apple en bordure de canvas 
   this.testMoveApple = function () {
       

        if (this.outOfGridApple("lat", depApple[1])) {
            depApple [1] = 0;
            return true;

        }

        if (this.outOfGridApple("lon", depApple[0])) {
            depApple [0] = 0;
            return true;

        }

        return false;   
    };
    
    // Méthode d'arrêt de la pomme si en bordure de cadre ou collision avec serpent
    this.stopApple = function () {
       this.x += 0;
       this.y += 0;
        
        return true;
    };
    
    // Métthode de test de collision avec le serpent
    this.noSnakeCollision = function () {
      
        for (i = 0; i < snake.trace.length; i++){
            if (this.x == snake.trace[i].x && this.y - 1 == snake.trace[i].y) {
                    return true;
                }
            if (this.x == snake.trace[i].x && this.y + 1 == snake.trace[i].y) {
                    return true;
                }
             if (this.x - 1 == snake.trace[i].x && this.y == snake.trace[i].y) {
                    return true;
                }
           if (this.x + 1 == snake.trace[i].x && this.y == snake.trace[i].y) {
                    return true;
                }
        }
        
        
    };


    // Méthode de test si Apple est en dehors du canvas
    this.outOfGridApple = function  (place, placeAfter) {
       
            placeAfter = placeAfter || 0 ;
            let placeTest ;
             
            if (place == "lon"){
                placeTest = this.x + placeAfter;
                if (placeTest >= 0 ){                   
                    testgridBounds [2] = true ;
                }
                if (placeTest < canvas.width/20) {
                    testgridBounds [3] = true ;
                }

                if (testgridBounds[2] == false || testgridBounds[3]  == false) {                   
                    testgridBounds = /* testgridBoundsInit */ [false /*haut*/, false /*bas*/, false /*gauche*/, false /*droite*/];

                   return true; 
                }
            }

             if (place == "lat"){
                placeTest = this.y + placeAfter;
                if (placeTest >= 0){
                    testgridBounds [0] = true ;
                }
                 if (placeTest < canvas.height/20) {
                     testgridBounds [1] = true ;
                }

                 if (testgridBounds[0]  == false || testgridBounds[1]  == false) {
                     testgridBounds = /* testgridBoundsInit */ [false /*haut*/, false /*bas*/, false /*gauche*/, false /*droite*/];

                 return true; 
                }
             }
            
             testgridBounds = [false /*haut*/, false /*bas*/, false /*gauche*/, false /*droite*/];
  
            return  false;
        };    
}


function deepAssign(o1, o2) {
    for (o in o2) {
 /*       if (typeof o2[o] === 'object' && typeof o1[o] !== 'undefined') {
            deepAssign(o1[o], o2[o]);
        }
        else {
 */           o1[o] = o2[o];
 //       }
    }
}


/**************************** Fonction Jeu ***************************/
function Game(querySelector, options)
{
    let opts = {
        intervalTime:  300,
        addObstacleTimeout: 500,
        obstacles: {
            'apple': 1,
            'teacher': 0,
        }
    };

    //var canvas = document.getElementById("zone");
    var _self = this;
    var canvas = document.querySelector(querySelector);
    var ctx = canvas.getContext('2d');

 //   var IdPlayer;
//    var player; 
    
    var intervalID = null;
    var gridSize = 20
    var gameGridWidth = canvas.width / gridSize;
    var gameGridHeight = canvas.height / gridSize;


    var applesTotProd;    
    var applesEaten;
    var apples;
    var obstacles;
    var timeout; 
    var snake;
    var apple;
    var obstacleLength;
    
    var applesExtraTime;
    
    let elapseTime = 0;
    let scoreTot = 0;
    let beginingLevelTime = new Date();
    let endLevelTime;
    let noEatenApple;

    let backToWork = false;

    this.init = function(options) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); 

        deepAssign(opts, options);
        elapseTime = 0;
        applesTotProd = 0;
        applesEaten = 0;
        apples = [];
        applesExtraTime = [];
        timeout = 0;        
        noEatenApple = gameLevels[currLevel].opts.obstacles.apple;
        snake = new Snake(Math.trunc(gameGridWidth / 2), Math.trunc(gameGridHeight / 2), 3);
        addApple(placeApple(), apples);    

    };
           
    
    /**************************** Fonction détermination place Apple ***************************/   
    function placeApple () {
        
        let apple;
        let randomX = Math.trunc(Math.random() * (gameGridWidth-1));
        let randomY = Math.trunc(Math.random() * (gameGridHeight-1));
        
        
         while (!testPosition (randomX, randomY)) {
            
            randomX = Math.round(Math.random() * (gameGridWidth-1));
            randomY = Math.round(Math.random() * (gameGridHeight-1));
        }
        
        apple = new Apple(randomX, randomY, snake, canvas);
        
        return apple;
    }
    

    /**************************** Fonctions  Ajout Apple ***************************/ 
    
    function addApple(apple, table ) {
        
       elapseTime = new Date () - beginingLevelTime;

        table.push(apple);
        applesTotProd++;

    }
 

// direction serpent en focntion de celle saisie par le joueur
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
    };

    this.start = function() {
                
        intervalID = setInterval(function() { 
 
            _self.run();
            _self.draw();
            
        }, opts.intervalTime);

    };

    this.onGameOver = function(){

        alert('G A M E  O V E R !!!');
            this.init(gameLevels[0]);
            scoreTot = 0;
            this.start();
        
    };

    this.onPause = function(){
        //alert('Game on pause. Hit space to continue');
//        player.pause();
    };
    
    this.onWin = function(){
        scoreTot = this.calcScore();
                
        if (confirm('You won ! \n' + 'Your total score is : ' + scoreTot + '\n\n Would you play again ?') ){
            
            game.init(gameLevels[0])

            game.start();
            
        }
            
  //       Fenetre de démarrage ou d'identification  :  
//          window.open(strUrl,)
       
 
    };

    this.calcScore = function () {
        
        let playerTimeResult;
        
        let bestTimeResult = applesTotProd * 50000 /* faire variable pour */;     
        
        if (backToWork == true) {
            playerTimeResult = elapseTime + endLevelTime - beginingLevelTime;
        }else {
            playerTimeResult = endLevelTime - beginingLevelTime;
        }
    
        let playerQuote = bestTimeResult / playerTimeResult ;
        let bonus = ~~(playerQuote * (scoreTot));
        

        if (playerQuote < 0.2) {
            
            bonus = 0;
        }

        return (scoreTot + bonus);  
    };
    
    this.endLevel = function () {
      
        endLevelTime = new Date ();
        
        scoreTot = this.calcScore();
        
        if (applesEaten == gameLevels[currLevel].opts.obstacles.apple) {
            
            alert('You have been eated ' + applesEaten + ' apples. \n You could eat ' + applesTotProd + ') \n' + 'Your score with Time bonus is : ' + scoreTot );
            
            // On auvegarde les données de ce niveau au cas où le joueur veuille revenir à ce niveau à la fin du niveau suivant
            if(!confirm ('Would you continue ?')){
                
                window.localStorage.setItem('currentLevel', JSON.stringify(gameLevels[currLevel]));  // Faire " this.newLevel() " lors de la récup de cette valeur
                window.localStorage.setItem('scoreTot', JSON.stringify(scoreTot));
          
            }
            
            return true;
        }
        
        return false;
    };
    
    this.newLevel = function () {
        
        let finishedLevel = gameLevels[currLevel];
        
         currLevel++;
        
        opts = {
            intervalTime:  finishedLevel.opts.intervalTime / (1.2),
            addObstacleTimeout: finishedLevel.opts.addObstacleTimeout / (1.2),
            obstacles: {
                'apple':finishedLevel.opts.obstacles.apple +=2,
                'teacher': finishedLevel.opts.obstacles.teacher +=2,
            },
            
        };
            gameLevels[currLevel] =
                {
                    levelName: gameLevels[currLevel].levelName,
                    opts,                
                };
          
//        gameLevels.push(opts);
        this.init(gameLevels[currLevel]);

        this.start();
    }
    
    this.run = function(opts,option) {     
   

        
        if (applesEaten >= gameLevels[currLevel].opts.obstacles.apple) {
            this.pause();

             if (currLevel >= gameLevels.length) {
                 this.onWin()
                endLevelTime = new Date ();
                this.calcScore();
                this.winner();
                return true;
            }

            if (this.endLevel()) {
                
               this.newLevel();
              
                return true;
            }

            
            
            return false;
        }
        
        /**************************************************************************
        *                                                                         *
        *   Dynamique de jeu                                                      *
        *                                                                         *
        **************************************************************************/
      
        // Mise en mouvement du serpent
        snake.move();

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
            
        if (snakeOutOfGrid() || snake.hasCollision()) {
            clearInterval(intervalID);
            this.onGameOver();
            return false;
        }

        let eating = false;
        apples = apples.filter((apple) => {
            
            let index = apples.indexOf(apple);
            
            if (snake.x == apple.x && snake.y == apple.y) {

                snake.eat();
                eating = true;
                applesEaten++;
                noEatenApple--;
 //               apples.splice(1,1);  // on enlève du tableau la pomme mangé (pour données localStorage)
                
                //Gestion du score primaire  -->  +10 à chaque pomme mangée (bonus en fonction du temps en fin de partie)
                scoreTot+=10;
                
                return false;
            }

            return true;
        });

         applesExtraTime = applesExtraTime.filter((apple) => {
            
            let index = applesExtraTime.indexOf(apple);
            
            if (snake.x == apple.x && snake.y == apple.y) {

                snake.eat();
                eating = true;
//                applesEaten++;           // On ne comptabilise pas la pomme comme une pomme du niveau à manger
                
                //score -->  +5 à chaque extra pomme mangée
                scoreTot+=5;
                
                return false;
            }

            return true;
        });

        if (eating && applesEaten < gameLevels[currLevel].opts.obstacles.apple && noEatenApple!=0 ) {
            
            setTimeout(addApple(placeApple(),apples), 1000);
        
        }

        if (timeout++ > 100) {
            timeout = 0 ;
            addApple(placeApple(),applesExtraTime);
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

        /**
        * Editer le score
        **/
         // Affichage du score
         ctx.font = '16px Arial';
         ctx.fillStyle = '#fff';
         ctx.fillText('Score: ' + scoreTot, 5, 20);
        
        /**
        * Editer le score
        **/
         // Affichage du score
         ctx.font = '16px Arial';
         ctx.fillStyle = '#fff';
         ctx.fillText('Pomme rouge à manger : ' + noEatenApple, 500, 20);

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
            ctx.fillStyle="#FF2550";
            ctx.fillRect(apple.x * gridSize, apple.y * gridSize, gridSize, gridSize);
            ctx.closePath();
        }, 40);
      
    };
    
    
    
    this.init(gameLevels[0]);

}

// Méthode test la position d'un objet par rapport au serpent
function testPosition () 
{     
    let test1 = false ;
    let test2 = false ;
    let cpt = 0; 
    let possib = false;
    let possib1 = true;
    let possib2 = true;
    
   if (typeof x != 'undefined') {
        if (x != snake.x) {
            cpt = 0;
            test1 = true ;
        }

        for (let j=1; j < snake.trace.length; j++) {
            if (x == snake.trace[j].x) {                    
                cpt += 1;
            }
        }
       if (cpt != 0) {
           test2 = false;
       }

       if (!test1 || !test2) {
           possib1 = false;
       }           
    }

    if (typeof y != 'undefined') {
       if (y != snake.y) {
            cpt = 0;
            test1 = true ;
        }

        for (let j=1; j < snake.trace.length; j++) {
            if (y == snake.trace[j].y) {
                cpt +=1; 
            }
        }
        
        if (cpt != 0) {
           test2 = false;
       }

        if (!test1 || !test2) {
           possib2 = false;
       }
    }

    if (possib1 && possib2) {
        possib = true;
    }
    
    return possib;  
}

// gestion des saisies direction au clavier
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

