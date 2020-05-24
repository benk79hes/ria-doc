
async function initApp()
{
    let configPromise = new Promise((resolve) => {
        $.get(
            "config.json", 
            resolve
        );
    });
    
    let config = await configPromise;

    let currLevel = 0;

    let game = new Game('#zone', config.gameLevels[0]);
    var navigation = new Navigation();
    
    game.onWin = function() {
        navigation.go('score');
        return;
    };
    
    
    
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
        currLevel++;
        if (currLevel >= config.gameLevels.length) {
            // alert('You won !');
        }
    
        game.init(config.gameLevels[currLevel]);
        navigation.go('game');
    });
    
    $('#replay-level').click(function(e){
        e.preventDefault();
    
        game.init(config.gameLevels[currLevel]);
        navigation.go('game');
    });



    /**
     * Gestion du drag and drop
     */
    $('#avatar-form').on('dragover dragenter', function(e){
        e.preventDefault();
        e.stopPropagation();
        $(this).addClass('is-dragover');
    });

    $('#avatar-form').on('dragleave dragend drop', function(e){
        e.preventDefault();
        e.stopPropagation();
        $(this).removeClass('is-dragover');
    });

    $('#avatar-form').on('drop', function(e){
        files = e.originalEvent.dataTransfer.files;
        document.getElementById('avatar-input').files = files;
    });

}

initApp();