
async function initApp()
{
    let configPromise = new Promise((resolve) => {
        $.get(
            "config.json", 
            resolve
        );
    });
    
    let config = await configPromise;


    let registrationStep;

    function getRegistrationStep() {
        registrationStep = localStorage.getItem('registration');
        if (registrationStep === null) {
            registrationStep = 0;
        } 

        return registrationStep;
    }
    
    function setRegistrationStep(v) {
        localStorage.setItem('registration', v);
    }
    
    // let gameRegistrationStep = localStorage.getItem('registration');
    // if (gameRegistrationStep === null) {
    //     gameRegistrationStep = 0;
    // } 

    // console.log(gameRegistrationStep);


    let currLevel = localStorage.getItem('currentLevel');
    if (currLevel === null) {
        currLevel = 0;
    }

    let scoreTot = parseInt(localStorage.getItem('scoreTot'));
    if (scoreTot === null) {
        scoreTot = 0;
    }


    let game = new Game('#zone', config.gameLevels[0], scoreTot);
    var navigation = new Navigation();
    
    game.onWin = function(score) {
        currLevel++;
        let resetScore = false;
        let goTo = 'score';


        
        if (currLevel >= config.gameLevels.length) {
            let hallOfFameStored = localStorage.getItem('hallOfFame');
            let hallOfFame;

            date = new Date();
    
            if (hallOfFameStored === null) {                  
                hallOfFame = [];
            }
            else {
                hallOfFame = JSON.parse(hallOfFameStored);
            }

            hallOfFame.push({
                nickName : localStorage.getItem('nickname'),
                score : localStorage.getItem('scoreTot'),
                date : date.toLocaleDateString() + " - " + date.toLocaleTimeString(),
                location : localStorage.getItem('location')
            });


            localStorage.setItem('hallOfFame', JSON.stringify(hallOfFame));


            currLevel = 0;
            score = 0;
            resetScore = true;
            goTo = 'winner';
            setRegistrationStep(0)
            
            /* localStorage.setItem('currentLevel', 0);
            localStorage.setItem('scoreTot', 0);

            game.init(config.gameLevels[0], true);

            navigation.go('winner'); */
        }
        else {
            /* localStorage.setItem('currentLevel', currLevel);
            localStorage.setItem('scoreTot', score);
            game.init(config.gameLevels[currLevel]);
            navigation.go('score'); */
        }

        localStorage.setItem('currentLevel', currLevel);
        localStorage.setItem('scoreTot', score);
        game.init(config.gameLevels[currLevel], resetScore);
        navigation.go(goTo);
    };

    game.onGameOver = function() {
        
  //      currLevel = window.localStorage.getItem('currentLevel');
  //      scoreTot = window.localStorage.getItem('scoreTot');

        game.init(config.gameLevels[currLevel]);
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

        let gameRegistrationStep = getRegistrationStep();

        if (gameRegistrationStep == 0) {
            navigation.go('register');
            return false;
        }

        if (gameRegistrationStep == 1) {
            navigation.go('choose-target');
            return false;
        }


        return true;
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
    


    /**
     * Hall of Fame
     *
     */
    let hallPage = new Page();


    hallPage.onBeforeShow = function(){
        
        document.getElementById('HallOfFameBodyTable').innerHTML = "";

        let tableau = document.getElementById('HallOfFameBodyTable');
        let hallOfFame = JSON.parse(localStorage.getItem('hallOfFame'));

        
        console.log(hallOfFame);
        
        if (hallOfFame === null){
            let ligne = tableau.insertRow(-1);
            let cell = ligne.insertCell(0);
            cell.colSpan = 4;
            cell.innerHTML = "Never play, never there !";
        }
        else {

            hallOfFame.sort(function(a,b){
                return b.score - a.score;
            });

            let hallOfFameLength = hallOfFame.length;
            let max = (hallOfFameLength > 10) ? 10 : hallOfFameLength;

            for (let i=0 ; i < max; i++){
               let ligne = tableau.insertRow(-1);

               let colonne1 = ligne.insertCell(0);
               colonne1.innerHTML += hallOfFame[i].nickName;
                
               let colonne2 = ligne.insertCell(1);
               colonne2.innerHTML += hallOfFame[i].score;

               let colonne3 = ligne.insertCell(2);
               colonne3.innerHTML += hallOfFame[i].date;

               let colonne4 = ligne.insertCell(3);
               colonne4.innerHTML += hallOfFame[i].location;
            }

        }
    };

    navigation.addPage('hall-of-fame', hallPage);
    
    
    let registrationPage = new Page();
    registrationPage.onShow = function(){
        console.log('hello');
        $('#registration-form [name=nickname]').val(localStorage.getItem('nickname'));
        $('#registration-form [name=location]').val(localStorage.getItem('location'));
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position){
                $('#registration-form [name=location]').val("Latitude: " + position.coords.latitude + 
                    ", Longitude: " + position.coords.longitude);
            });
        }
    };
    
    navigation.addPage('register', registrationPage);


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

        // Ok, formulaire valide

        localStorage.setItem('nickname', nickname);
        localStorage.setItem('location', location);

        setRegistrationStep(1);
        navigation.go('choose-target');
    });
   


    /**
     * Gestion du drag and drop
     */
    $('.droppable').on('dragover', function(ev){
        ev.preventDefault();
    });

    $('.droppable').on('drop', function(ev){
        ev.preventDefault();
        
        let data = ev.originalEvent.dataTransfer.getData("text");

        let originalParent = document.getElementById(data).parentNode;

        ev.target.appendChild(document.getElementById(data));

        setRegistrationStep(2);

        var imgProf = new Image();
        let iconName = $('#' + data).data('icon');
        console.log(data);
        console.log(iconName);
        
        imgProf.src = 'ressources/img/teachers/' + iconName +'_icon.jpg';
        
        let loaded = false;

        imgProf.onload = function(){
            loaded = true;
            game.setTargetImage(imgProf);
            console.log(imgProf);
            console.log(game);
            navigation.go('game');
            setTimeout(function(){
                originalParent.appendChild(document.getElementById(data));
            }, 1000);
        }
    });

    $('.draggable').on('dragstart', function(ev){
        ev.originalEvent.dataTransfer.setData("text", ev.target.id);
    });

}

initApp();