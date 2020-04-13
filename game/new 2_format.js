let canvas = document.getElementById("zone");
let ctx = canvas.getContext('2d');
 
let timeout = 0; 
 
 // Déplacement sur le canvas
 let depX=depY=0;
 let derMouv=1;
 let derMouvStop=0;
 
let largeur = hauteur = 20;
    
 // départ serpent
let x = Math.trunc(Math.random()*canvas.width/largeur)*largeur;
let y = Math.trunc(Math.random()*canvas.height/hauteur)*hauteur;


ctx.fillStyle="#F1C40F";
ctx.fillRect(x, y, largeur, hauteur);

//taille "pomme"
let pomLarg = pomHaut = 20;

// Position "pomme" aléatoire
let pomX= Math.trunc(Math.random()*canvas.width/largeur)*largeur; ;
let pomY= Math.trunc(Math.random()*canvas.height/hauteur)*hauteur;

/*
// Affichage de la 2pomme"
pom.fillStyle="#FF0000";
pom.fillRect(pomX, pomY, pomLarg, pomHaut);
*/

let trace=[];
let tailleTrace=1;
let sautTrace=5;
let tailleMaxTrace=1000; // Cette valeur sera changé plus tard (enfin, à voir)

let hist, compteBoucle = 0;
let sautBoucle = 100 ;
    
let gameLevel = 5;

window.onload=function() {

	const intervalID = setInterval(jeu,100);  // rafraichissement toutes les 10millisecondes

	document.addEventListener("keydown",keyboard);
    
}

function jeu(){
    
x+=depX*largeur;  // déplacement horizontal
y+=depY*hauteur;  // déplacement vertical 

// pour faire en sorte de n'avoir que 1 point qui se déplace >> 
ctx.clearRect(0, 0, canvas.width, canvas.height); 

 
ctx.fillStyle="#F1C40F";
ctx.fillRect(x, y, largeur, hauteur);
 
 // Trace du serpent
trace.push({x:x,y:y});

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

while(trace.length>tailleTrace){
 // pour enlèver un élément
 trace.shift();
 }
 
 for(let i=0;i<trace.length;i++) {
 ctx.fillRect(trace[i].x,trace[i].y, largeur, hauteur);
 }

// Il faut gérer la trace lors de la fonction pause car elle disparaît

		
 // Affichage de la 2pomme"
ctx.beginPath();
ctx.fillStyle="#FF0000";
ctx.fillRect(pomX, pomY, pomLarg, pomHaut);
ctx.closePath();
		
 // Action sur la "pomme"
 if( x==pomX && y==pomY){
 //Gestion du score quand il y aura
 //score+=10 + 2 * ((tailleTrace - tailleInitTrace)/sautTrace); 
 
 // collision
 // Dès que collision avec pomme, on augmente la taille (BUT : pour vérif la collision ici)
  if(tailleTrace<tailleMaxTrace){
 tailleTrace+=sautTrace;
 }
 // Si la taille a été augmenté on enlève un saut d'expansion de trace
 /*
 if(tailleTrace>tailleInitTrace){
 tailleTrace-=sautTrace;
 }
 */
 //sautBoucle = 10 ;
 //sautBoucle--;
}
    // On positionne la pomme ailleurs au bout d'un certain temps
else if(timeout++ >100){
 timeout = 0 ;
 pomX = Math.trunc(Math.random()*canvas.width/largeur)*largeur;
 pomY= Math.trunc(Math.random()*canvas.height/hauteur)*hauteur;
 }
    
    // Gestion des limites
    outOFBound(gameLevel);
    
    // Qui se mord la queue perd
    for(let i=1;i<trace.length;i++) {
            if( trace[0].x == trace[i].x && trace[0].y == trace[i].y && trace.length >1 /*trace[0].x < x <= trace[i].x && x != pomX */)
                {
                    alert("Ton fiel venimeux t'a perdu !");
                }
    }
}

    // fonction gérant le serpent qui va en-dehors du cadre
function outOFBound(gameLevel){
    switch(gameLevel){
        
        // sort d'un côté et rentre de l'autre côté
        case 0 :
            if(x > canvas.width)
            {
                x = 0;
                break ;
            }
            else if(x < 0)
            {
                x = canvas.width ;
                break ;
            }
            else if (y > canvas.height)
            {
                y = 0 ;
                break ;
            }
            else if (y < 0)
            {
                y = canvas.height ;
                break ;
            }
            break ;
        
        // sort et se replace de manière aléatoire en changeant le sens du déplacement du serpent (plus simple à jouer car plus intuitif)
        case 3 :
            if(x > canvas.width || x < 0)
                {
                    do
                    {
                        x = Math.trunc(Math.random()*canvas.width/largeur)*largeur;                        
                    }while (x == pomX );
                    
                    if (depX == 1)
                    {
                        depX = -1 ;
                    }
                    else
                        depX = 1;
                    
                    break ;
                }
                else if (y > canvas.height || y <0)
                {
                    do
                    {
                        y = Math.trunc(Math.random()*canvas.height/hauteur)*hauteur;
                    }while (y == pomY);
                    
                    if (depY ==1 )
                    {
                        depY = -1;
                    }
                    else
                        depY = 1;
                    
                    break ;
                }
 
            break ;
       
        // sort et se replace de manière aléatoire sans changer le sens du déplacement du serpent (plus difficile à jouer car moins intuitif)
        case 5 :
            if(x > canvas.width || y > canvas.height)
                {
                    do
                    {
                        x = Math.trunc(Math.random()*canvas.width/largeur)*largeur;
                         y = Math.trunc(Math.random()*canvas.height/hauteur)*hauteur;
                    }while (x == pomX || y == pomY);
                    break ;
                }
                else if (y <0 || x < 0)
                {
                    do
                    {
                        x = Math.trunc(Math.random()*canvas.width/largeur)*largeur;
                        y = Math.trunc(Math.random()*canvas.height/hauteur)*hauteur;

                    }while (x == pomX || y == pomY);
                    break ;
                }
            break ;
         
        // partie perdue si sortie du cadre
        case 10 :
            if(x > canvas.width || y > canvas.height || y <0 || x < 0)
            {
                alert("Droit dehors, vous avez perdu !");
                break;
            }
            break;
    }
}

function endLoser () {
    for(var i=0;i<trace.length;i++) {
        if(x == trace[i].x || y == trace[i].y)
            {
                alert("Ton fiel venimeux t'a perdu!");
            }
    }
    
}
    
function keyboard(evt) {
//var timeoutTemp ;
 switch(evt.keyCode) {
 case 37:
 // touche gauche
 if(derMouv==39 || derMouv==68 || derMouv==32){break;}  // permettra de ne pas faire demi-tour
 depX=-1;
 depY=0;
 derMouv=evt.keyCode;
 break;
 
 case 65:
 // touche gauche (a)
 if(derMouv==39 || derMouv==68 || derMouv==32){break;}  // permettra de ne pas faire demi-tour
 depX=-1;
 depY=0;
 derMouv=evt.keyCode;
 break;
 
 case 38:
 // touche haut
 if(derMouv==40 || derMouv==83 || derMouv==32){break;}  // permettra de ne pas faire demi-tour
 depX=0;
 depY=-1;
 derMouv=evt.keyCode;
 break;

 case 87:
 // touche haut (w)
 if(derMouv==40 || derMouv==83 || derMouv==32){break;}  // permettra de ne pas faire demi-tour
 depX=0;
 depY=-1;
 derMouv=evt.keyCode;
 break;
 
 case 39:
 // touche droite
 if(derMouv==37 ||derMouv==65 || derMouv==32){break;}  // permettra de ne pas faire demi-tour
 depX=1;
 depY=0;
 derMouv=evt.keyCode;
 break;
 
 case 68:
 // touche droite (d)
 if(derMouv==37 ||derMouv==65 || derMouv==32){break;}  // permettra de ne pas faire demi-tour
 depX=1;
 depY=0;
 derMouv=evt.keyCode;
 break;
 
 case 40:
 // touche bas
 if(derMouv==38 || derMouv==87 || derMouv==32){break;}  // permettra de ne pas faire demi-tour
 depX=0;
 depY=1;
 derMouv=evt.keyCode;
 break;
 
 case 83:
 // touche bas (s)
 if(derMouv==38 || derMouv==87 || derMouv==32){break;}  // permettra de ne pas faire demi-tour
 depX=0;
 depY=1;
 derMouv=evt.keyCode;
 break;
 
 case 32:
 // touche espace pour pause ??
 // Gestion du redémarrage serpent dans la direction où il  allait
 if(derMouvStop==37 || derMouvStop==65){  
 depX=-1;
 depY=0;
 derMouv = derMouvStop;
 derMouvStop=evt.keyCode;
 break;
 }
 if(derMouvStop==38 || derMouvStop==87){  
 depX=0;
 depY=-1;
 derMouv = derMouvStop;
 derMouvStop=evt.keyCode;
 break;
 }
 if(derMouvStop==39 || derMouvStop==68) {
 depX=1;
 depY=0;
 derMouv = derMouvStop;
 derMouvStop=evt.keyCode;
 break;
 }
 if(derMouvStop==40 || derMouvStop==83 ){  
 depX=0;
 depY=1;
 derMouv = derMouvStop;
 derMouvStop=evt.keyCode;
 break;
 }
 depX=0;
 depY=0;
 derMouvStop = derMouv ;
 derMouv =evt.keyCode;
 break;
 
 }