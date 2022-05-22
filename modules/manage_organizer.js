import {db} from '/modules/db.js';

// Indexed DB auslesen START
export async function readOrganizer(){
    const org = await db.readOne('termin');
};
// Indexed DB auslesen ENDE

// In der Indexed DB speichern START
export function saveOrganizer(organizer){
    db.writeDB('termin',organizer);
}
// In der Indexed DB speichern ENDE