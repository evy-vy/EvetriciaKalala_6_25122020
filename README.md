# SO Pekocko  
*Projet N°6 Openclassrooms*

---------

## Contexte du projet 
-----

Vous êtes développeur backend freelance et vous travaillez depuis quelques années sur des projets web pour des startups ou des grandes entreprises.    

La semaine dernière, vous avez reçu un mail vous proposant un nouveau projet.  
La marque So Pekocko, qui crée des sauces piquantes, connaît un franc succès, en partie grâce à sa chaîne de vidéos YouTube “La piquante”.  
L’entreprise souhaite se développer et créer une application web, dans laquelle les utilisateurs pourront ajouter leurs sauces préférées et liker ou disliker les sauces proposées par les autres.

## Mission 
-----

La mission consiste à creer la partie backend et L'API du MVP.  

## Informations
-----

Suite à quelques attaques sur le site web, il faut veiller à utiliser des principes de code sécurisé.  
L'API doit:  
* Respecter les standards OWASP  
* Etre hébergé par un serveur Node  
* Utiliser MongoDB comme base de données
* Utiliser le pack Monggose  
* Utiliser le framework Express  

## Installation  
-----

*Pour le frontend:*  

Le lien du dépôt GitHub pour la partie frontend est le suivant : [Piquante](https://github.com/OpenClassrooms-Student-Center/dwj-projet6)  

1. Cloner le projet
2. Exécuter npm i
3. Exécuter npm start
4. Exécution de l'API sur [localhost:4200](http://localhost:4200)

*Pour le backend*

1. commande: nodemon server  
2. Exécution de l'API sur [localhost:3000](http://localhost:3000)

*Uri permettant de se connecter à la DB:*  
Voir le fichier .env.example.  
Remplacer les données dans le fichier app.js, puis mongoose.connect, avec du code valide.  

----------------