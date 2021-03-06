# my-notes-app
My notes app. First project for CAS FEE certificate

Bei der Umsetzung sind folgende Lib's verwendet:

*  Moments.js   https://momentjs.com/
*  Mustache.js  https://github.com/janl/mustache.js/
*  Pickaday     https://github.com/dbushell/Pikaday
*  Rating       http://callmenick.com/post/five-star-rating-component-with-javascript-css

Ich habe bewusst auf JQuery verzichtet.

Die Kommunikation zwischen Frontend und Backend wurde mit dem Fecht API realisiert.

Des weiteren habe ich im Frontend ES6 Klassen und Module verwendet. Import/Export wird aktuell noch nicht
von allen Browsern unterstützt! Die folgenden Browser unterstützen Import/Export, da muss aber das feature noch 
eingeschalted werden:

* Chrome 60 – behind the Experimental Web Platform flag in chrome:flags.
* Firefox 54 – behind the dom.moduleScripts.enabled setting in about:config.
* Edge 15 – behind the Experimental JavaScript Features setting in about:flags.

Login/Logout verwendet aktuell einen default Benutzer/Passwort. Habe hier noch keinen Benutzer Verwaltung
umgesetzt.

## node.js

Um die App mit node.js auf dem eigenen Rechner zu starten, muss node.js installiert sein. Informationen zur installtion
sind hier zu finden:

https://nodejs.org

Anschliessend im root Verzeichniss folgende Befehle ausführen um die App zu starten:
```
    $ npm install
    $ node index.js
```
Sobald node.js gestartet ist, kann via Port 8080 auf my-nodes-app zugegriffen werden

http://localhost:8080

## docker

Weiter kann das gesamte Projekt innerhalb eines Docker Kontainer ausgef?hrt werden. Neben Docker CE muss noch
Docker-Compose installiert sein.

* Docker CE: https://docs.docker.com/engine/installation/
* Docker Composer: https://docs.docker.com/compose/install/

Anschliessen im Root Verzeichniss folgenden Befehl ausführen um den Kontainer zu starten:
```
    $ docker-compose up
```
Nachdem der Kontainer gestartet ist kann via Port 8080 auf my-notes-app zugegriffen werden. Auf dem Port 80 wird
ein ngins WebServer gestartet der nur auf das Frontend zeigt.

* note.js: http://localhost:8080
* nginx: http://localhost

Sämtliche änderungen am Code werden anschliessend automatisch in den Kontainer übernommern. 
NotesJS überwacht alle Dateien und startet neu, wenn sich ein Datei ändert.

Wer einfach nur die my-notes-app ausführen möcht kann das aktuelle Image aus der Cloud mit folgendem 
Befehl ausführen.

docker run -p 8080:8080 pepeblack/my-notes-app:latest

Have fun...
