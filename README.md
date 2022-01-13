# Tower defense
### RATP VS MMI

## Etat d'avancement du projet:

### Etapes manquantes : 
##### Scénarisation
    Texte disponible via le lien [Google Document](https://docs.google.com/document/d/1ko3EoUktDg9wHWMBDJeZEbZlfWXUZKedX0Tq9drJQdM/edit)
    Pas eu le temps de l'implémenter

##### Pattern du path
    Les fichiers visuels n'ont pas été reçu à temps

##### Pathing
    La génération du chemin crée parfois des chemins dont des parties peuvent se superposer.
    Il y a normalement quelque chose qui prévient de cela, mais le code ne marche pas convenablement. Impossible de trouver la raison.

##### Equilibrage du jeu
    Le développement n'ayant pas pu être terminé, les phases de play test n'ont pas pu être réalisés non plus, d'où l'absence d'un réel équilibrage. Le jeu reste jouable sans pour autant être trop simple

##### Gestion de la vitesse du jeu
    Le bouton est présent,  mais rien ne se passe quand on appuie dessus.
    Il est possible de le faire fonctionner en déplaçant le code de la fonction et en rappelant la fonction régulièrement pour vérifier d'une éventuelle mise à jour de la vitesse, mais pour une raison inconnue, les vagues arrêtent de s'incrémenter (donc plus d'ennemis).

##### Rédaction des textes de description des tours
    Les tours ont différentes fonctionnalités : 
        Les controleurs sont de simples tours, peu cher, faible dégat, un seul ennemi est visé
        Les gichets ralentissent tous les ennemis qui sont dans leur portée
        Les super controlleurs font des dégâts explosifs. Dès qu'un monstre prend des dégâts, les autres monstres dans un certain rayon autour prennent des dégats aussi.
    Il faudra mettre à jour les fenêtres d'information au survol des tours

##### Mise en place du CSS pour les modals jQuery
    Des modals jQuery ont été mise en place pour intéragir avec l'utilisateur entre les menus. Ils n'ont pas pu être stylisés avec du CSS.

##### Résolution d'autres bugs
    - Pour faire apparaître la tour sous son curseur pour en créer une, il faudra au préalable survoler le chemin. Il faudrait que ce soit le cas dès la pression du clique de souris
    - Parfois les tours cessent de tirer sur les ennemis et ne tirent plus par la suite

