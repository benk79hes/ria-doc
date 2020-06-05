
async function initApp()
{
    let configPromise = new Promise((resolve) => {
        $.get(
            "config.json", 
            resolve
        );
    });
    
    let config = await configPromise;

    let currLevel = window.localStorage.getItem('currentLevel');
    if (currLevel === null) {
        currLevel = 0;
    }

    let scoreTot = window.localStorage.getItem('scoreTot');
    if (scoreTot === null) {
        scoreTot = 0;
    }

    let game = new Game('#zone', config.gameLevels[0], scoreTot);
    var navigation = new Navigation();
    
<<<<<<< Updated upstream
    game.onWin = function(score) {
        currLevel = window.localStorage.getItem('currentLevel');

        if (currLevel >= config.gameLevels.length) {
            let hallOfFameStored = window.localStorage.getItem('hallOfFame');
            let hallOfFame = [];
=======
    game.onWin = function(score) {     
        
        if (currLevel >= config.gameLevels.length-1) {
            let hallOfFameStored = localStorage.getItem('hallOfFame');
            let hallOfFame;
>>>>>>> Stashed changes

            if (hallOfFameStored !== null) {
                hallOfFame = hallOfFameStored;
            }

            hallOfFame.push(score);
            window.localStorage.setItem('hallOfFame', hallOfFame);

<<<<<<< Updated upstream
            window.localStorage.setItem('currentLevel', 0);
            window.localStorage.setItem('scoreTot', 0);
=======
            localStorage.setItem('hallOfFame', JSON.stringify(hallOfFame));
            
            localStorage.setItem('currentLevel', 0);
            localStorage.setItem('scoreTot', 0);
            currLevel = 0;
            
            game.init(config.gameLevels[currLevel], true);
>>>>>>> Stashed changes

            game.init(game.config.gameLevels[0],false);
                        
            navigation.go('winner');
        }
        else {
<<<<<<< Updated upstream
            window.localStorage.setItem('currentLevel', JSON.stringify(currLevel));
            window.localStorage.setItem('scoreTot', JSON.stringify(score));
            game.init(config.gameLevels[currLevel]);
=======
            currLevel++;
            localStorage.setItem('currentLevel', currLevel);
            localStorage.setItem('scoreTot', score);
            game.init(config.gameLevels[currLevel], false);
>>>>>>> Stashed changes
            
            navigation.go('score');
        }
    };

    game.onGameOver = function() { 
        
        currLevel = JSON.parse(window.localStorage.getItem('currentLevel'));
        scoreTot = JSON.parse(window.localStorage.getItem('scoreTot'));

        console.log("curLevel" + currLevel);
        console.log("scoreTot" + "SCOREscoreSCOREscore");
        
        
        navigation.go('game-over');
    };
    
    
    displayLevelName = function(){

        setTimeout(function() {
            document.getElementById('tempo').innerHTML = game.opts.levelName;
        }, 500);
      
   };
    
    
    game.onResetAll = function() {
        
        /*
            window.localStorage.setItem('currentLevel', 0);
            window.localStorage.setItem('scoreTot', 0);

            game.init(config.gameLevels[0],false);
        */
        
        window.localStorage.removeItem('currentLevel');
        window.localStorage.removeItem('scoreTot');

        //game.init(config.gameLevels[0], true);
        
       // game = new Game('#zone', config.gameLevels[0], false);
        
         
    };
    
    
    /**
     * Game Page
     */
    let pageGame = new Page();
    
    
    
    //document.getElementById('tempo').innerHTML = opts.levelName;

    pageGame.onInit = function(){
        initKeyboardController(game);
      
 /*       setTimeout(function() {
            console.log("game level : " + game.opts.levelName);
            document.getElementById('tempo').innerHTML = game.opts.levelName;
        }, 500);    };
 */   

    };
    
    pageGame.onBeforeShow = function() {
    };
    
    pageGame.onShow = function(){
        // Change behaviour depending on game state
 
/*        setTimeout(function() {
            console.log("game level : " + game.opts.levelName);
            document.getElementById('tempo').innerHTML = game.opts.levelName;
        }, 500);
*/      
        displayLevelName();
        
        game.start();

    };
    
    pageGame.onBeforeHide = function(){
                
        game.pause();

    };
    
    navigation.addPage('game', pageGame);
        
       
    /**
     * Level completed page
     */
    $('#next-level').click(function(e){
        e.preventDefault();
    
        game.init(config.gameLevels[currLevel+1]);
        navigation.go('game');
    });
       
    $('#replay-level').click(function(e){
        e.preventDefault();
        
        game.init(game.config.gameLevels[currLevel], );

        navigation.go('game');
    }); 

    $('#reset-all').click(function(e){
        e.preventDefault();
    
        game.onResetAll();
        game.init(config.gameLevels[0], true);
        
        navigation.go('game');        
    }); 
    
    
    /**
     * Gestion du drag and drop
     */
    $('#avatar-control').on('dragover dragenter', function(e){
        e.preventDefault();
        e.stopPropagation();
        $(this).addClass('is-dragover');
    });

    $('#avatar-control').on('dragleave dragend drop', function(e){
        e.preventDefault();
        e.stopPropagation();
        $(this).removeClass('is-dragover');
    });

    $('#avatar-control').on('drop', function(e){
        files = e.originalEvent.dataTransfer.files;
        document.getElementById('avatar-input').files = files;
    });

}

initApp();