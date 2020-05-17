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
    var tailleMaxTrace = 1000; // Cette valeur sera changé plus tard (enfin, à voir)


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

/**************************** Objet Apple ***************************/

function Apple(x, y, snake, canvas)
{
    this.x = x;
    this.y = y;

    snake = snake;    
    canvas = canvas;
//    let intervalTime = 150;
    
    this.depDirection;
    let depApple = [0,0];
    let moveAlea;
 //   let testgridBoundsInit = [false /*haut*/, false /*bas*/, false /*gauche*/, false /*droite*/] ;
    let testgridBounds = /* testgridBoundsInit */ [false /*haut*/, false /*bas*/, false /*gauche*/, false /*droite*/];
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
        
        return false;
        
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
            
             testgridBounds = /* testgridBoundsInit */ [false /*haut*/, false /*bas*/, false /*gauche*/, false /*droite*/];
  
            return  false;
        };    
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


/**************************** Player ********************************/
function Player (idPlayer)
{
    let player = document.querySelector('#' + idPlayer);
 /*   
  this.play = function () {
      player.play();
    } 
   
  this.pause = function () {
      player.pause();
  } 
*/
}


/**************************** Fonction Jeu ***************************/
function Game(querySelector, options)
{
    let opts = {
        levelName: 'First level',
        intervalTime:  150,
        addObstacleTimeout: 500,
        obstacles: {
            'apple': 1,
            'teacher': 0,
        }
    }

    //var canvas = document.getElementById("zone");
    var _self = this;
    var canvas = document.querySelector(querySelector);
    var ctx = canvas.getContext('2d');

    var IdPlayer;
    var player; 
    
    var intervalID = null;
    var gridSize = 20
    var gameGridWidth = canvas.width / gridSize;
    var gameGridHeight = canvas.height / gridSize;


    var applesTotProd;    
    var applesEaten;
    var apples;
    var timeout; 
    var snake;
    
    let scoreTot = 0;
    let score = 0;
    let beginingLevelTime = new Date();
    let endLevelTime;

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
console.log('init');
        player = new Player(document.getElementById(opts.IdPlayer)) ;
        deepAssign(opts, options);
//        score = 0;
        applesTotProd = 0;
        applesEaten = 0;
        apples = [];
        timeout = 0; 
        snake = new Snake(Math.trunc(gameGridWidth / 2), Math.trunc(gameGridHeight / 2), 3);
 //       player.play();
        addApple();
    };

    /**************************** Fonction détermination place Apple ***************************/   
    function placeApple () {
        
        let randomX = Math.trunc(Math.random() * (gameGridWidth-1));
        let randomY = Math.trunc(Math.random() * (gameGridHeight-1));
        const coordonnateApple = [randomX,randomY];
        let test1 = false ;
        let test2 = false ;
        
         while (!testPosition (randomX, randomY)) {
            
            randomX = Math.round(Math.random() * (gameGridWidth-1));
            randomY = Math.round(Math.random() * (gameGridHeight-1));
        }
        
        return coordonnateApple;
    }
    

    /**************************** Fonction Ajout Apple ***************************/   
    function addApple() {
        
        let coordonnateApple = placeApple();
        
        let apple = new Apple(coordonnateApple[0], coordonnateApple[1], snake, canvas);
                
        apples.push(apple);
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
 //       alert('Game over');

        if (confirm ("Game Over !!!!!\n Voulez-vous recommencer ?")) {
            this.init(options);
            scoreTot = 0;
            this.start();
        }
        else {
            
        }
        
    };

    this.onPause = function(){
        //alert('Game on pause. Hit space to continue');
//        player.pause();
    };
    
//    this.onWin = function(){
//        scoreTot = this.calcScore();
        
/*        alert('You have been eated ' + applesEaten + ' apples. \n (You could eat ' + applesTotProd + ') \n' + 'Your score with Time bonus is : ' + scoreTot );
    };
*/
    this.calcScore = function () {
        
//        let scoreTot;
        
        let bestTimeResult = applesTotProd * 50000 /* faire variable pour */;       
        let playerTimeResult = endLevelTime - beginingLevelTime;
        
console.log("playerTimeResult = " + playerTimeResult);                

        let playerQuote = bestTimeResult / playerTimeResult ;
        let bonus = ~~(playerQuote * (scoreTot));
        
console.log("bonus = " + bonus);                


        if (playerQuote < 0.2) {
            
            bonus = 0;
        }
console.log("score fin = " + (scoreTot + bonus));                
        return (scoreTot + bonus);  
    };
    
    this.endLevel = function () {
  console.log("apples.length : " + apples.length);                
      
        endLevelTime = new Date ();
        
        scoreTot = this.calcScore();
        
        if (applesEaten == opts.obstacles.apple) {
            
            // à changer avec une page html
            
            alert('You have been eated ' + applesEaten + ' apples. \n (You could eat ' + applesTotProd + ') \n' + 'Your score with Time bonus is : ' + scoreTot );
            return true;
        }
        
        return false;
    };
    
    this.run = function() {     
   
console.log('run fonction');

        
        if (applesEaten >= opts.obstacles.apple) {
            this.pause();

            if (this.endLevel()) {
                calcScore(); 
                return true;
            }

            if(this.onWin()) {
                endLevelTime = new Date ();
                calcScore();
                this.onWin();
                return true;
            }
            
            return false;
        }
        
        /**************************************************************************
        *                                                                         *
        *   Dynamique de jeu                                                      *
        *                                                                         *
        **************************************************************************/

        // Lecture musique pendant niveau
  /*          player.play( player=> {
                player.play();
                
            }, 10000);
  */      
        
        // Mise en mouvement du serpent
        snake.move();

        // Mise en mouvement de la pomme
        if (apples.length > 0) {
            apples.forEach(apple => {
                if(/* apples[apples.length-1] */ apple.noSnakeCollision() ){
                    /* apples[apples.length-1] */ apple.stopApple();
                }
                else {
                    /* apples[apples.length-1] */ apple.moveApple();
                }
            }, opts.addObstacleTimeout);
        }
            
        if (snakeOutOfGrid() || snake.hasCollision()) {
            clearInterval(intervalID);
            console.log(intervalID);
            this.onGameOver();
            return false;
        }

        let eating = false;
        apples = apples.filter((apple) => {

            if (snake.x == apple.x && snake.y == apple.y) {

                snake.eat();
                eating = true;
                applesEaten++;
//Gestion du score primaire  -->  +10 à chaque pomme mangée (bonus en fonction du temps en fin de partie)
 scoreTot+=10;
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
 console.log('DRAW');

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
        * Editer le score (TEMPORAIREMENT en js !!!!!!!!!!!!!!!!!!)
        **/
         // Affichage du score
         ctx.font = '16px Arial';
         ctx.fillStyle = '#fff';
         ctx.fillText('Score: ' + scoreTot, 5, 20);

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
        }, 40);

    };
    
    this.init(options);

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


