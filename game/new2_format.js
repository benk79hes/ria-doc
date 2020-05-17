/******************************************************************************
*                                                                             *
*   SNAKE IT !                                                                *
*                                                                             *
*   Fichier principal du jeu Snake It                                         *
*                                                                             *
******************************************************************************/




/**************************************************************
*
*                            Variables globales
*
***************************************************************/

//let game;
//let intervalID = null;
//let intervalTime = 150;
//let nbrApple = 5;
//Game game;
let date = new Date ();
let score = 0;
//let score=document.getElementById("score");
let compteBoucle = 0;
let sautBoucle = 10;
let timeAppleBoss = 10; 
let timeAppleRegular = 10; 



/********************** Début Jeu *********************** */

window.onload = function() {
    this.game = new Game('#zone');    
    initKeyboardController(game);
    game.start();
}




/*****************   Audio ************************************/

function music(chemin) {
        
        let audio_el=document.createElement('audio');
        
        let s_ogg=document.createElement('source');
        s_ogg.setAttribute('type','audio/ogg');
        s_ogg.setAttribute('src',chemin+'.ogg');
        audio_el.appendChild(s_ogg);
        
        let s_mp3=document.createElement('source');
        s_mp3.setAttribute('type','audio/mp3');
        s_mp3.setAttribute('src',chemin+'.mp3');
        audio_el.appendChild(s_mp3);
        return audio_el;
    }
        
        
    /**************************** Objet Snake ***************************/

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
    this.direction =0;
    
    let tailleTrace = this.trace.length;
    let sautTrace = 2;
    let tailleMaxTrace = 1000; // Cette valeur sera changé plus tard (enfin, à voir)


    // Méthode sélection de la direction du Serpent
    this.setDirection = function(dir) {

        console.log(dir);
        /**
         * Eviter le demi-tour
         */
        if (this.direction == (dir + 2) % 4)
            return;


        /**
         * Changement de direction
         */

        this.direction = dir;

    }
  
    // Méthode de déplacement du Serpent
    this.move = function(){
        let depX, depY;
        
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

    // Méthode augmentation taille serpent quand mange Apple
    this.eat = function() {
        if (tailleTrace < tailleMaxTrace) {
            tailleTrace += sautTrace;
        }
    }

    // Méthode serpent qui se mord la queue
    this.hasCollision = function() {
        for (var i = 1; i < this.trace.length; i++) {
            if (this.trace[i].x == this.x && this.trace[i].y == this.y){
                return true;
            }
        }
        return false;
    }
}

    /**************************** Objet Apple ***************************/

function Apple(x, y, snake, canvas, date)
{
    this.x = x;
    this.y = y;

    snake = snake;    
    canvas = canvas;
    let intervalTime = 150;
    
    this.depDirection;
    let depApple = [0,0];
    let moveAlea;
 //   let testgridBoundsInit = [false /*haut*/, false /*bas*/, false /*gauche*/, false /*droite*/] ;
    let testgridBounds = /* testgridBoundsInit */ [false /*haut*/, false /*bas*/, false /*gauche*/, false /*droite*/];
    let tabDirectionInit = ["Freez", "Up", "Down", "Left", "Right"];
    let tabDirection = tabDirectionInit;
    let choiceDirection;  //String
    let choiceMove;   //int
    
    
    // Méthode pour créer le déplacement aléatoire
    this.randomMove = function () {
        
        choiceMove = Math.round(Math.random()*4);                    
        choiceDirection = tabDirection [choiceMove];
        
        while (choiceDirection == null){
            
            choiceMove = Math.round(Math.random()*4);                    
            choiceDirection = tabDirection [choiceMove];
            
        } 
        
        tabDirection = tabDirectionInit;  

console.log("randomMove result : " + choiceDirection) ;       
        
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
    this.moveApple = function ( ){
        console.log("timeReg moveAppl : " + timeAppleRegular);            

        let checkTime = new Date();
           
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
    this.noSnakeCollision = function ( ) {
         
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


    /**************************** Fonction Jeu ***************************/

function Game(querySelector, date)
{
    date = new Date();
    //var canvas = document.getElementById("zone");
    let _self = this;
    let canvas = document.querySelector(querySelector);
    let ctx = canvas.getContext('2d');
    
 //   this.canvasWidth = this.canvas.width;
//    this.canvasHeight = this.canvas.height;

    let intervalID = null;
    let intervalTime = 150;
    let gridSize = 20

    let timeout = 0;
    let gameTimeout = 0;
    
 //   let lastDirection;
    
    // position sur le canvas
    //var depX = depY = 0;
    let gameGridWidth = canvas.width / gridSize;
    let gameGridHeight = canvas.height / gridSize;

    let snake = new Snake(Math.trunc(gameGridWidth / 2), Math.trunc(gameGridHeight / 2), 3);
console.log("snake.x = " + snake.x);
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
 /*    addApple( function (game) { 
        
        let coordonnateApple = placeApple();
        
        let apple = new Apple(coordonnateApple[0], coordonnateApple[1], snake, canvas, date);;
 
         apples.push(apple);

     }, 200);
    
 */   
    function addApple(game) {
        
        let coordonnateApple = placeApple();
        
        let apple = new Apple(coordonnateApple[0], coordonnateApple[1], snake, canvas, date);
                
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

/*        setIntervalApple( function () {
            apples[apples.length-1].moveApple();
        }, 1000);
*/
    };
    
    this.run = function() {
        
        /**************************************************************************
        *                                                                         *
        *   Dynamique de jeu                                                      *
        *                                                                         *
        **************************************************************************/

timeAppleRegular --;
//console.log("timeReg moveAppl : " + timeAppleRegular);            

compteBoucle ++;
        
        snake.move();
         
         
  let timer = 200;
        
            if (apples.length > 0) {
                if( /* apples[apples.length-1].testMoveApple() || */ apples[apples.length-1].noSnakeCollision() ){
console.log("StopApple while collision");
                    apples[apples.length-1].stopApple();
                    
                }
                
  
                else {
                    apples[apples.length-1].moveApple();

/*                    if (apples[apples.length-1].testMoveApple()) {
 //                       sautBoucle --;
                   
                        if (sautBoucle <=0) {
                          apples[apples.length-1].moveApple();
                          sautBoucle = 5;
                            
console.log("sautBoucle post : " + sautBoucle);

                        }
                        
                    }else {
                        apples[apples.length-1].moveApple();
                    }
*/                     
                }
            }
        
        

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
//Gestion du score
 score+=10; 
                return false;
            }
            
            return true;
        });
        
        if (eating) {
            setTimeout(addApple, 1000);
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
        * Editer le score (TEMPORAIREMENT !!!!!!!!!!!!!!!!!!)
        */
         // Affichage du score
         ctx.font = '16px Arial';
         ctx.fillStyle = '#fff';
         ctx.fillText('Score: ' + score, 5, 20);
        
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


