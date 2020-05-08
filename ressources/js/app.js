

var gameLevels = [
    {
        levelName: 'First level',
        intervalTime:  300,
        addObstacleTimeout: 50,
        obstacles: {
            'apple': 1,
            'teacher': 0,
        }
    },
    {
        levelName: 'Second level',
        intervalTime:  280,
        addObstacleTimeout: 50,
        obstacles: {
            'apple': 2,
            'teacher': 0,
        }
    },
    {
        levelName: 'First level',
        intervalTime:  200,
        addObstacleTimeout: 50,
        obstacles: {
            'apple': 6,
            'teacher': 0,
        }
    },
];

let currLevel = 0;

let game = new Game('#zone', gameLevels[0]);
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





$('#next-level').click(function(e){
    e.preventDefault();
    currLevel++;
    if (currLevel >= gameLevels.length) {
        // alert('You won !');
    }

    game.init(gameLevels[currLevel]);
    navigation.go('game');
});

$('#replay-level').click(function(e){
    e.preventDefault();

    game.init(gameLevels[currLevel]);
    navigation.go('game');
});