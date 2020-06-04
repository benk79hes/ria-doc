
async function initApp()
{
    let configPromise = new Promise((resolve) => {
        $.get(
            "config.json", 
            resolve
        );
    });
    
    let config = await configPromise;

    let gameRegistrationStep = window.localStorage.getItem('registration');
    if (gameRegistrationStep === null) {
        gameRegistrationStep = 0;
    } 


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

<<<<<<< HEAD
            addHallOfFame();
  //          window.localStorage.setItem('hallOfFame', JSON.stringify(hallOfFame));
=======
            if (hallOfFameStored !== null) {
                hallOfFame = JSON.parse(hallOfFameStored);
            }

            hallOfFame.push({
                nickname: '',
                score: score
            });
            window.localStorage.setItem('hallOfFame', JSON.stringify(hallOfFame));
>>>>>>> e9efb8780c1010ea48a0902c213ecba59f0b2804

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
        addHallOfFame();
        
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

    /**
     * Hall of Fame
     *
     */
     $('#hall-of-fame').click(function(e){
            e.preventDefault();

         let tableau = document.getElementById("HallOfFameBodyTable");
         let hallOfFame = window.localStorage.getItem('hallOfFame');

         if (hallOfFame === null){
             let ligne = tableau.insertRow(-1);
             ligne,innerHTML += "Never play, never there !";
         }
         else {

             hallOfFame.sort(function(a,b){
                 return b.score - a.score;
             });

             hallOfFameLength = hallOfFame.length;
             max = (hallOfFameLength > 10) ? 10 : hallOfFameLength;

             for (i=0 ; i < max; i++){
                let ligne = tableau.insertRow(-1);

                let colonne1 = ligne.insertCell(0);
                colonne1.innerHTML += hallOfFame[i].nickName;

                let colonne2 = ligne.insertCell(1);
                colonne2.innerHTML += hallOfFame[i].location;;

                let colonne3 = ligne.insertCell(2);
                colonne3.innerHTML += hallOfFame[i].date;

                let colonne4 = ligne.insertCell(3);
                colonne4.innerHTML += hallOfFame[i].location;

             };

         }

            navigation.go('hall-of-fame');        
        }); 

    function addHallOfFame () 
    {    
        let hallOfFameStored = window.localStorage.getItem('hallOfFame');

                date = new Date();
                if (hallOfFameStored === null) {
                        let hallOfFame = [];
                           hallOfFame.push( {
                                nickName : windows.localStorage.setItem('nickName'),
                                score : windows.localStorage.setItem('scoreTot'),
                                date : date.toLocaleDateString() + "//" + date.toLocaleTimeString,
                                location : windows.localStorage.setItem('location')
                            },
                        );
                    hallOfFame.foreach(fame => 
                      fame.foreach(element =>
                            if (element === null){
                                hallOfFame.splice(fame.findIndex,1);
                            });
                       );
                }
                else {
                    hallOfFame = JSON.parse(hallOfFameStored);

                    hallOfFame.push(
                        nickName : windows.localStorage.setItem('nickName'),
                        score : windows.localStorage.setItem('scoreTot'),
                        date : date.toLocaleDateString() + "//" + date.toLocaleTimeString,
                        location : windows.localStorage.setItem('location')
                    );
                }


                window.localStorage.setItem('hallOfFame', JSON.stringify(hallOfFame));

    }

<<<<<<< HEAD
    
=======
    let registrationPage = new Page();
    registrationPage.onInit = function(){
        $('#registration-form [name=location]')
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position){
                $('#registration-form [name=location]').val("Latitude: " + position.coords.latitude + 
                    ", Longitude: " + position.coords.longitude);
            });
        }
    };
    
    navigation.addPage('registration', registrationPage);


    $('#register-button').click(function(e){
        e.preventDefault();

        $('#registration-form input').removeClass('error');
        console.log($('#registration-form input'));
        
        let nickname = $('[name=nickname]').val();
        console.log(nickname);
        let location = $('[name=location]').val();

        if (!nickname) {
            $('[name=nickname]').addClass('error');
            return false;
        }
        if (!location) {
            $('[name=location]').addClass('error');
            return false;
        }

        window.localStorage.setItem('nickname', nickname);
        window.localStorage.setItem('location', location);

        gameRegistrationStep = 1;
        navigation.go('choose-target');
        // Ok, formulaire valide
        // ...
    });


    $('#select-target-button').click(function(e){
        e.preventDefault();

        // Check qu'on a choisi un prof
        // Affecter le nom de l'image à la variable

        // si pas de prof choisi
        let target = '' // image du prof

        // if (! target) {
        //     return false;
        // }


        gameRegistrationStep = 2;

        // window.localStorage.setItem('target', target);
        navigation.go('game');
    });



>>>>>>> e9efb8780c1010ea48a0902c213ecba59f0b2804
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