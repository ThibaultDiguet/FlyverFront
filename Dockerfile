### Utiliser l'image officielle de Node.js
##FROM node:alpine
##
##COPY . /app
##
### Définir le dossier de travail dans le conteneur
##WORKDIR /app
##
### Copier les fichiers package.json et package-lock.json
##COPY package*.json ./
##
### Installer les dépendances du projet
##RUN npm install
##
### Installer Angular CLI globalement
##RUN npm install -g @angular/cli
##
### Installer Spartan UI CLI globalement
##RUN npm i -D @spartan-ng/cli
##
### Exposer le port par défaut d'Angular
##EXPOSE 4200
##
### Commande par défaut : start du serveur Angular
##CMD ["npm","run", "start"]
#
## Utilise l’image Node officielle
#FROM node:alpine AS dev
#
## Crée le dossier de travail
#WORKDIR /usr/src/app
#
## Copie package.json + package-lock.json, installe les deps
#COPY package*.json ./
#RUN npm ci
#
#RUN npm i -g @angular/cli
#RUN npm i -D @spartan-ng/cli
#
## Copie tout le projet
#COPY . .
#
## Expose le port par défaut d'ng serve
#EXPOSE 4200
#
## Lance Angular en mode dev, écoute sur toutes les interfaces
#CMD ["npm", "run", "start"]

# Étape de dev basée sur Alpine
FROM node:alpine AS dev

# Crée le dossier de travail
WORKDIR /app

# Installe les dépendances sans copier le code pour profiter du cache Docker
COPY package*.json ./
RUN npm install

# Installe Angular CLI et Spartan UI CLI globalement
RUN npm install -g @angular/cli \
    && npm install -D @spartan-ng/cli

# Copie le reste du projet
COPY . .

# Angular écoute sur 0.0.0.0 pour être accessible depuis l'hôte
EXPOSE 4200

CMD ["ng", "serve", "--host", "0.0.0.0", "--poll", "100"]

