# Régles de style

Ce document établi les règles de style pour le code javascript de ce projet.


## Règles générales

Tout fichier javascript comportant des variables globales, des fonctions et de
l'ésecution de code doit séparer clairement et dans l'ordre ces blocs:

- variables globales
- fonctions
- execution de code


## Lignes de code

Les lignes ne devraient pas dépasser 80 charactères de longueur. 

Les appels de fonctions ne présentent pas d'espaces entre le nom de la fonction
et les parentèses

```
foo(a);
```

Les opérateurs comportent toujours des espaces avant et après

```
foo = a;
```





## Blocs de code

Les blocs de code sont de 4 espaces. Nous n'utilisons pas les tabulations
pour permettre l'utilisation de tout éditeur qui ne prendrait pas en charge les indentations par tabulation.

Les conditions `if`, les boucles `while`, `for` etc comportent la structure
suivante:

```
if (CONDITION) {
    ...
}
```

Le mot clé `if` est suivi d'un espace, la parentèse fermante de la condition
est suivie d'un espace. Le code de la condition ne suit jamais sur la même 
ligne.

Les `switch` `case` sont quant à eux structurés de la manière suivante avec 
indentation des `case` par rapport au `switch`, et indentation des blocs à 
l'intérieur des `case`:

```
switch (VAR) {
    case 0:
    case 1:
        ...

    case 2:
        ...
}
```


## Conditions et éléments entre parentèses

A l'intérieur des parentèses des espaces sont insérés entre les conditions
ainsi qu'entre les opérateurs, mais pas après la parentèse ouvrante ni avant la
parentèse fermante de la manière suivante:

```
if (a == b && b == c * 3) {
    ...
}
```

En ce qui concerne les parentèse des fonctions, que ce soit à la définition ou 
à l'appel, les arguments sont séparés par une visrgule et un espace:

```
function foo (a, b, c) {

}

foo(a, b, c);
```


