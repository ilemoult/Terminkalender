import {
    el,
    group,
    create,
    deepCopy
}from '/modules/lib.js';


import
{
    Termin,
    organizer,
    calendar,
}from './termine.js'

import
{
    saveOrganizer
}from './manage_organizer.js'

let counter = 0;
let appointment_terminated;

export function createinput(){

    // Flag um die Fertigstellung des Termines festzulegen
    appointment_terminated = false;
    counter ++;
    if(counter >= 2){return}                // Erlaubt nur ein 'terminContainer' Fenster zur Zeit

    // Wrapper START
    let div = create('div');
    div.className = 'divformular';
    el('#terminContainer').appendChild(div);
    // Wrapper ENDE

    // Tag START
    // Tag Wrapper START
    let tag = create('div');
    tag.className = 'tag';
    div.append(tag);
    // Tag Wrapper ENDE

    let divTag = create('div');
    divTag.className = 'divtag';
    tag.append(divTag);
    el('.divtag').innerText = `Datum:`;

    let inputTag = create('input');
    inputTag.className = 'inputtag';
    tag.append(inputTag);
    //el('.inputtag').value = 'Wählen Sie einen Tag ';
    el('.inputtag').addEventListener('click',function()
    {
        // Flag initializieren
        clickOnTag.clickOnTag = false;
        // Hinweise für den Benutzer
        el('.inputtag').value = 'Wählen einen Tag im Kalender';
        // Verwalten Warte auf Benutzer Tat
        WaitForClickOnTag(appointment_terminated);
    });

    let dropDownWdh = create('select');
    dropDownWdh.className = 'wdh';
    tag.append(dropDownWdh);
    el('.wdh').innerText;
       
    let wdhDropDown = ['Wdh.','täglich','wöchentlich','monatlich','jährlich'];
    for (let i = 0; i < wdhDropDown.length; i++){
        let wdhOpt = create('option');
        wdhOpt.value = wdhDropDown[i];
        wdhOpt.innerText = wdhDropDown[i];
        dropDownWdh.append(wdhOpt);
    }
    // Tag ENDE

    // Titel START
    // Titel Wrapper START
    let titel = create('div');
    titel.className = 'titel';
    div.append(titel);
    // Titel Wrapper ENDE

    let divTitel = create('div');
    divTitel.className = 'divtitel';
    titel.append(divTitel);
    el('.divtitel').innerText = `Titel:`

    let inputTitel = create('input');
    inputTitel.className = 'inputtitel';
    titel.append(inputTitel);
    el('.inputtitel').innerText;
    // Titel ENDE

    // Uhrzeit START
    // Uhrzeit Wrapper START
    let uhr = create('div');
    uhr.className = 'uhrzeit';
    div.append(uhr);
    // Uhrzeit Wrapper ENDE

    let divUhr = create('div');
    divUhr.className = 'divuhr';
    uhr.append(divUhr);
    el('.divuhr').innerText = `Uhrzeit:`

    let uhrBis = create('div');
    uhrBis.className = 'bis';
    uhr.append(uhrBis);
    el('.bis').innerText = `bis`

    let inputVon = create('input');
    inputVon.className = 'inputvon';
    uhr.append(inputVon);
    el('.inputvon').innerText;

    let inputBis = create('input');
    inputBis.className = 'inputbis';
    uhr.append(inputBis);
    el('.inputbis').innerText;
    // Uhrzeit ENDE

    // Notiz START
    let notizen = create('div');
    notizen.className = 'notizen';
    div.append(notizen);
    el('.notizen').innerText = `Notizen:`

    let inputNotiz = create('input');
    inputNotiz.className = 'inputnotiz';
    notizen.append(inputNotiz);
    el('.inputnotiz').innerText;
    // Notiz ENDE

    // Location START
    let location = create('div');
    location.className = 'location';
    div.append(location);
    el('.location').innerText = `Location:`

    let inputlocation = create('input');
    inputlocation.className = 'inputlocation';
    div.append(inputlocation);
    el('.inputlocation').innerText;
    // Location ENDE

    // Kategorie START
    let kategorie = create('div');
    kategorie.className = 'kategorie';
    div.append(kategorie);
    el('.kategorie').innerText = `Kategorie:`

    let dropDown = create('select');
    dropDown.className = 'select';
    kategorie.append(dropDown);
    el('.select').innerText;
       
    let kategorien = ['Bitte wählen','Lunch','Beruf','Privat','Familie','Freunde','Party','Geburstag'];
    for (let i = 0; i < kategorien.length; i++){
        let opt = create('option');
        opt.value = kategorien[i];
        opt.innerText = kategorien[i];
        dropDown.append(opt);
    }
    // Kategorie ENDE

    // Button bearbeiten START
    // Button Wrapper START
    let divButtons = create('div');
    divButtons.className = 'buttons';
    div.append(divButtons);
    // Button Wrapper ENDE

    let buttonEdit = create('button');
    buttonEdit.className = 'buttonedit';
    divButtons.append(buttonEdit);
    el('.buttonedit').innerText = `SAVE`;
    el('.buttonedit').addEventListener('click',save);
    // Button bearbeiten ENDE

    // Button abbrechen START
    let buttonQuit = create('button');
    buttonQuit.className = 'buttonquit';
    divButtons.append(buttonQuit);
    el('.buttonquit').innerText = `QUIT`;
    el('.buttonquit').addEventListener('click',deleteinput);
    // Button abbrechen ENDE
};


function WaitForClickOnTag(appointment_terminated)
{
    if(!clickOnTag.clickOnTag)
    {
        // Wartet auf dem Klick des Users auf einem Tag
        setTimeout(WaitForClickOnTag,100);
    }
    else
    {
        // Ausgewälte Tag aus dem Kalender abfragen und anzeigen
        updateDatum(appointment_terminated);
    }
}

function updateDatum(appointment_terminated)
{
    if(el('.divformular') !=null)
    {
        if(!appointment_terminated)
        {
            // Wartet auf dem Klick des Users auf einem Tag
            setTimeout(updateDatum,100);
            // Ausgewälte Tag aus dem Kalender abfragen und anzeigen
            el('.inputtag').value = calendar.getDateNumbers();
        }
    }
}

// delete Button START
function deleteinput(appointment_terminated){
        if (el('.divformular')) {
            let neuerTermin = el('.divformular');
            neuerTermin.parentNode.removeChild(neuerTermin);
            counter = 0;
            // Termin abgesagt
            appointment_terminated = true;
        }
};
// delete Button ENDE

// save Button START
function save(appointment_terminated)
{
    // Neues Termin Object mit Angabe speichern
    let termin = Object.create(Termin);
    termin.title = el('.inputtitel').value;
    termin.datum = el('.inputtag').value;
    termin.startTime = el('.inputvon').value;
    termin.endTime = el('.inputbis').value;
    termin.text = el('.inputnotiz').value;
    termin.location = el('.inputlocation').value;
    termin.categorie = el('.select').value;

    //Kopie von aktuellen Kalender und Termine List
    let organizer_update =
    {
        calendar: deepCopy(organizer.calendar),
        data: deepCopy(organizer.data)
    };
    
    AddEventOrganizer(termin);
    saveOrganizer(organizer)


    // Termin ist abgeschlossen
    appointment_terminated = true;

    

    console.log('termin');
    console.log(termin);

    console.log('organizer update');
    console.log(organizer_update);

    deleteinput(appointment_terminated);

}





//ManageOrganizer = function (eventform) {
function AddEventOrganizer  (eventform)
{
    // Kopieren des aktuell Organizer Events Liste
    //let data = deepCopy(organizer.data.data);

    // Konvert Datum von String zu Zahlen 
    let dateNumber = eventform.datum.split('.');
    console.log('dateNumber');
    console.log(dateNumber);

    console.log('dateNumber[0]');
    console.log(dateNumber[0]);
    
    // Ein einzel Id für den Termin angeben
    eventform.id = new Date().getUTCMilliseconds();

    // Jahr: dateNumber[2]]
    // Monat: dateNumber[1]
    // Tag: dateNumber[0]
  
    const event_arr = [];
    event_arr.push(eventform);
    organizer.data[dateNumber[2]][dateNumber[1]][dateNumber[0]] = event_arr;
    console.log(organizer);

};
    
