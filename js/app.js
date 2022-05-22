import {
    el,
    group,
    create,
    addButton
}from '../modules/lib.js';

import {
    termine
}from '../modules/termine.js';

import
{
    createinput
}from '../modules/select_date.js';

import
{
    readOrganizer
}from '../modules/manage_organizer.js';

// Serviceworker Abfrage START
function serviceworkerActive(){
 
    if ('serviceWorker' in navigator){

        // ServiceWorker registrieren
        navigator.serviceWorker.register('./service-worker.js',{scope:'./'})
        .then(() => {
            console.log('Service Worker erfolgreich registriert');
        })
        .catch((error) => {
            console.log(error,'Uuups, da ist etwas schief gelaufen');
         })

    };

};
// serviceworkerActive();
// Serviceworker Abfrage ENDE

termine();
readOrganizer();
addButton();

// Eine neuen Termin erstellen
el('#calendarContainer-btn').addEventListener('click',createinput);


