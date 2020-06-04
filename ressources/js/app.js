
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
    
    game.onWin = function(score) {
        currLevel++;


        if (currLevel >= config.gameLevels.length) {
            let hallOfFameStored = window.localStorage.getItem('hallOfFame');
            let hallOfFame = [];

            if (hallOfFameStored !== null) {
                hallOfFame = JSON.parse(hallOfFameStored);
            }

            hallOfFame.push(score);
            window.localStorage.setItem('hallOfFame', JSON.stringify(hallOfFame));

            window.localStorage.setItem('currentLevel', 0);
            window.localStorage.setItem('scoreTot', 0);

            game.init(config.gameLevels[0], true);

            navigation.go('winner');
        }
        else {
            window.localStorage.setItem('currentLevel', currLevel);
            window.localStorage.setItem('scoreTot', score);
            game.init(config.gameLevels[currLevel]);
            navigation.go('score');
        }
    };

    game.onGameOver = function() {
        navigation.go('game-over');
    }
    
    
    
    /**
     * Game Page
     */
    let pageGame = new Page();
    
    pageGame.onInit = function(){
        initKeyboardController(game);
    };
    pageGame.onBeforeShow = function() {
    
    };
    pageGame.onShow = function(){
        // Change behaviour depending on game state
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
    
        game.init(config.gameLevels[currLevel]);
        navigation.go('game');
    });
    
    /*
    $('#replay-level').click(function(e){
        e.preventDefault();
    
        game.init(config.gameLevels[currLevel]);
        navigation.go('game');
    }); */



    let registrationPage = new Page();
    registrationPage.onInit = function(){
        $('#registration-form [name=location]')
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position){
                $('#registration-form [name=location]').val("Latitude: " + position.coords.latitude + 
                "<br>Longitude: " + position.coords.longitude);
            });
        }
        else { 
            x.innerHTML = "Geolocation is not supported by this browser.";
        }
    };


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
        console.log(files);
        document.getElementById('avatar-input').files = files;
    });

}

initApp();