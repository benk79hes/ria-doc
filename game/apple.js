
function Apple(x, y, game)
{
    this.x = x;
    this.y = y;
    let snake = game.snake;

    this.depDirection;
    let depApple = [0,0];
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
          
        if (this.outOfGridApple("lat", depApple[1])) {
            depApple [1] = 0;
        }
        else
        if (this.outOfGridApple("lon", depApple[0])) {
            depApple [0] = 0;
        }
    
        this.x += depApple[0];
        this.y += depApple[1];                 
    };
 
    
    // Méthode d'arrêt de la pomme si en bordure de cadre ou collision avec serpent
    this.stopApple = function () {
        this.x += 0;
        this.y += 0;
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
            if (placeTest < game.gameGridWidth) {
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
            if (placeTest < game.gameGridHeight) {
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
