
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
