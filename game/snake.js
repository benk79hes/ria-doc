
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
    this.direction = 0; 
    
    var tailleTrace = this.trace.length;
    var sautTrace = 2;
    var tailleMaxTrace = 500; // Cette valeur sera changé plus tard (enfin, à voir)

    this.setDirection = function(dir) {

        /**
         * Eviter le demi-tour
         */
        if (this.direction == (dir + 2) % 4)
            return;


        /**
         * Changement de direction
         */

        this.direction = dir;
    };

    this.move = function(){
        var depX, depY;
        
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

        while (this.trace.length > tailleTrace) {
            // pour enlèver un élément
            this.trace.pop();
        }
    };

    this.eat = function() {
        if (tailleTrace < tailleMaxTrace) {
            tailleTrace += sautTrace;
        }
    };

    this.hasCollision = function() {
        for (var i = 1; i < this.trace.length; i++) {
            if (this.trace[i].x == this.x && this.trace[i].y == this.y){
                return true;
            }
        }
        return false;
    };
}
