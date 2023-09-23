## v1.1.0 Latest

### Ajouts
- Ajout du gestionnaire d'onglet dans les fiches de Personnage, Shaani et Réseau
- Ajout de l'Acteur "Loot"
- Les Pouvoirs sont maintenant classé par rang dans le compendium qui leur est dédié
- Les Bonus d'Acquis peuvent maintenant être activés et désactivés via la coche qui leur est associé dans l'onglet Acquis

### Modifications
- Mise à jour de la boite de dialogue de configurationd de Token en fonction de celle du core
- Le style des onglets Morphe et Magie ont été mis à jour pour suivre les onglets Pouvoirs et Acquis
- La fonction Puiser a été améliorée -> Il sera maintenant possible de puiser même si vous ne sélectionnez pas un Token. (Il faudra tout de même qu'un personnage soit lié au joueur)
- Les Trihn Max des PNJ ne sont plus calculés automatiquement et ne sont plus limités au maximum (Cela permet maintenant de leur donner une Âme négative sans problème) 

## v1.0.9

### Ajouts
- Fonction Test de Trihn ajoutée à gauche des Trihns (Cliquer sur le dé correspondant)
- Ajout d'un bouton d'Activation des bonus d'Acquis dans l'onglet Acquis. (Pour l'instant il n'y a que le bouton, la gestion des bonus arrivera prochainement).

### Correction de bug

- Correction d'un bug qui empêchait les joueurs de lancer un jet de nécrose depuis les spécialisations si la fonction de difficulté était activée
- Correction d'un bug qui faussait les scores en ne prenant pas en compte les bonus d'Acquis lors de tests de spécialisation

## v1.0.8

### Ajouts
- Ajout de la fonction "Acheter" dans le Navigateur de Compendium, onglet Acquis
- Ajout d'une fonction permettant d'afficher un Acquis dans le chat (Comme les pouvoirs auparavant)
- Ajout de la gestion des quantités d'Acquis depuis les fiches de personnage

### Modifications
- Modification du Navigateur de Compendium afin qu'il devienne transparent lorsque l'on glisse/dépose un objet afin de voir une potentielle fiche derrière lui
- Déplacement du bouton d'affichage d'Acquis et de Pouvoirs dans le chat (Il faudra maintenant cliquer sur l'image de ces derniers)
- Les HP max d'un Shaani sont maintenant des Input modifiable et ne sont plus calculés automatiquement en fonction des Domaines
- Le système de gestion des Crédos a été modifié, dorénavant, il ne faudra plus remplir la zone de texte comme c'était le cas avant, il faudra utiliser les boutons à droite de cette dernière. (Pensez à bien noter vos Crédos au cas où un quelconque problème arriverait)
- Le style des onglets Acquis et Pouvoirs ont été modifiés dans toutes les fiches

## v1.0.7

### Ajouts
- Bloc de notes caché pour les MJ dans les fiches de Personnage, Shaani et Réseau.
- Zone de texte pour les langues parlées dans l'onglet biographie des Personnages.
- Ajout du Navigateur de Compendium
- Possibilité de ranger les Pouvoirs et Items dans l'ordre que l'on souhaite dans leurs tableaux.

### Modifications
- Déplacement du prestige de l'onglet Acquis le header, sous l'expérience.
- Corrections de Bugs
- Correction d'un bug qui rendait obsolète les scènes sur lesquelles des tokens avaient leurs barres de vie activées.
- Correction d'un bug qui réinitialisait les bonus de spécialisations à la valeur des ActiveEffects qui leur étaient liés (Suppression des ActiveEffects dans les compendiums de Race/Peuple/Caste/Métiers).

## v1.0.6

### Bug Fixes
Correction d'un bug qui affichait "Echec" lors d'un test réussi.
Correction d'un bug qui rendait impossible le lancement des tests de domaines
Modification :

La régénération naturelle prend maintenant en compte le malus des trihns négatifs.

## v1.0.5

### Ajouts et Changements

- Changement des titres des catégories de pouvoirs/acquis/trihns en blanc sur toutes les fiches pour les rendre plus visibles.
- Correction de Bugs :
- Correction d'un bug dans le quel la fonction puiser ne permettait pas de choisir un seul dé dans le quel puiser dans certains cas.
- Correction d'un bug dans le quel le score final n'était pas le bon.
- Correction d'un bug dans le quel on ne pouvait pas ouvrir la fiche de Race de son personnage
- Correction d'un bug dans le quel les trihns ne s'actualisaient pas comme il faut lorsque l'on puisait.

## v1.0.4

### Ajouts et Modifications

- Ajout de la Réserve ainsi que d'un bouton de régénération naturelle dans les fiches de Créature et de PNJ.
- Ajout du calcul du Bonus max de spécialisation et d'Acquis selon votre niveau de domaine lors des jets.
- Ajout de la Race "Nécrosien" dans le compendium des Races.
- Modification mineure des messages dans le chat lors d'un test de Nécrose.
- Modification mineure des boutons de compendiums et de création pour les Pouvoirs et Acquis.

### Corrections de bugs
- Correction d'un bug qui empêchait le système de fonctionner avec certains modules.
- Correction d'un bug où l'arrière- plan des fiches de Créature et de PNJ ne s'affichait pas comme il faut.
- Rajout des pouvoirs de Magie dans le compendium des Pouvoirs qui n'apparaissaient pas.

## v1.0.3

- Agrandissement de la zone de texte des motivations pour que la scrollbar ne s'affiche plus.
- Changement de l'affichage des Acquis dans les fiches de personnages :
-> Dorénavent, seules les catégories dans lesquelles vous possedez des Acquis s'afficheront. Le bouton de création d'Acquis est donc déplacé au dessus de toutes les catégories (Au même niveau que celui du compendium des Acquis) afin de quand même pouvoir créer des Acquis dans les catégories non- affichées. (cf screenshot)

Correction de bugs:
- Correction d'un bug empêchant le joueur de puiser dans certains cas.
- Correction d'un bug dans le quel les Trihns ne s'actualisaient pas comme il faut lorsque le joueur puisait.
- Correction d'un bug dans le quel "Pouvoir Racial" dans l'onglet des pouvoirs ne s'affichait pas correctement.

## v1.0.1- beta

- Ajout de la fonctionnalité Puiser lors des jets. \
- Changement des zones de texte dans les fiches d'Acteur. \
- Ajout des Active Effects sur les Items et mise à jour des Compendiums \
- Ajout d'un paramètre permettant de ne pas demander la difficulté lors des jets de spécialisation (Shift + Click pour faire l'inverse sans modifier le paramètre).


## v1.0.0- beta.1

- Mise à niveau vers la version 11.299 de FoundryVTT \
- Changement des DB pour les compendiums \
- Ajout des fichiers dans les compendiums et tri

## v1.0.0- beta

- Lancement de la Beta du système Shaan Renaissance pour FoundryVTT
