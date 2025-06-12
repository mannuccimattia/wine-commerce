### ESERCIZIO: Setup Web App Express (Parte 1)

repo: `webapp-express`

#### Esercizio

Ciao ragazzi, è ora di mettere alla prova le vostre conoscenze iniziando a costruire la vostra prima app completa! Ecco i primi step
- Utilizzando il file in allegato, creiamo un database con MySQL Workbench
- Creiamo una nuova applicazione Express
- Colleghiamo l’app al db e verifichiamo che tutto funzioni
- Prepariamo una rotta index per ottenere la lista dei film
- Prepariamo una rotta show per ottenere i dettagli di un singolo film e le sue recensioni

*(Numero minimo di push: da oggi non vi comunicherò il numero minimo di push, dovendo lavorare su più giorni sulla stessa repo)*

#### Bonus
- Inserire delle immagini nel progetto express e dunque nel db
- Inserire i dati di connessione al database come variabili d’ambiente
- Inserire le vostre API in controller
- Inserire le vostre rotte in un router
- Inserire un middleware per le rotte inesistenti
- Inserire un middleware per la gestione errori
- Creare un middleware per le immagini
- Mostrare la media delle recensioni nel dettaglio del libro

---

### ESERCIZIO: Setup Web App React (Parte 2)

repo: `webapp-react` e `webapp-express`

#### MILESTONE 1

- Configuriamo l’app di backend (repo webapp-express) a ricevere chiamate dalla nostra applicazione React, installando e impostando il middleware CORS (npm i cors)
- Installate axios nell'app frontend e provate quindi ad effettuare una chiamata Ajax dalla home del progetto React, per ottenere la lista dei libri

#### MILESTONE 2

- In ultimo, effettuiamo una chiamata AJAX dalla pagina di dettaglio per ottenere il dettaglio di un singolo film, comprese le sue recensioni

#### Bonus

- Realizzare una componente StarsRating in cui mostrare il voto delle recensioni (magari anche il voto medio, chissà....)
- Curare l’aspetto estetico della vostra applicazione

---

### ESERCIZIO: Setup Web App React (Parte 3)

repo: `webapp-react` e `webapp-express`

#### Esercizio

Miglioriamo l’esperienza dell’utente inserendo

- ##### MILESTONE 1 (BACKEND)

  - Predisponiamo un’API per salvare nel database una nuova recensione legata ad un film
  - Testiamola su postman e verifichiamo che nel DB venga effettivamente inserita una nuova recensione

- ##### MILESTONE 2 (FRONTEND)

  - Creiamo un componente che contenga il form per le recensioni
  - Inseriamo questo componente nella pagina di dettaglio del film
  - All’invio del form, la nuova recensione viene salvata sul database e visualizzata nella pagina, in fondo alle altre