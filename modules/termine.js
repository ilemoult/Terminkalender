import {db} from '/modules/db.js';

import {saveOrganizer} from '/modules/manage_organizer.js';
/**
 * 
 */
export const Termin =
{
        title: " ", // z.b "Mittagsessen "
        datum: 0,
        startTime: "", // "12:00"
        endTime: "", // 13:00"
        text: "", // Notizen
        location:"", //  z.b "zu Hause ", "86 Oppenheimer Landstrasse Mannheim 68309"
        categorie:"",
        id:0
}

export let organizer,calendar;



export function termine(){

    /**
     * 
     * Datei format:
     * {
     *   Jahr:{
     *          Monat: 
     *          }
     *          
     * }
     * Object { 2022: {…}, 2023: {…}, 2024: {…}, 2025: {…}, 2026: {…}, 2027: {…}, 2028: {…}, 2029: {…}, 2030: {…}, 2031: {…} }
​​​
            2022 // Jahr: 
            {
            ​​
                1 // Monat: 
                { 
                        
                    20// Tag: [
                        {
                            startTime: "10:00",
                            endTime: "12:00",
                            text: "Some Event Here"
                        },
                        {
                            startTime: "13:00",
                            endTime: "14:00",
                            text: "Some Event Here"
                        }
                    ],

                    21// Tag: [
                        {
                            startTime: "10:00",
                            endTime: "12:00",
                            text: "Some Event Here"
                        },
                        {
                            startTime: "13:00",
                            endTime: "14:00",
                            text: "Some Event Here"
                        }
                    ]
                ​​} // Ende Monat,

                2 // Monat: 
                { 
                        
                    14// Tag: [
                        {
                            startTime: "10:00",
                            endTime: "12:00",
                            text: "Some Event Here"
                        },
                        {
                            startTime: "13:00",
                            endTime: "14:00",
                            text: "Some Event Here"
                        }
                    ]
                ​​} // Ende Monat,


                 3 // Monat: 
                { 
                        
                    14// Tag: [
                        {
                            Title: "Mittagsessen "
                            startTime: "12:00",
                            endTime: "13:00",
                            text: "Some Event Here",
                            location:"zu Hause",
                            categorie:"lunch",
                        },
                        {
                            startTime: "13:00",
                            endTime: "14:00",
                            text: "Some Event Here"
                        }
                    ]
                ​​} // Ende Monat,

            } // Ende Jahr
     */


    // function that creates dummy data for demonstration START
    function createDummyData() {
        let date = new Date();
        let data = {};

        for (let i = 0; i < 10; i++) {
            data[date.getFullYear() + i] = {};

            for (let j = 0; j < 12; j++) {
                data[date.getFullYear() + i][j + 1] = {};

		/*for (let k = 0; k < Math.ceil(1 * 10); k++) {
                    let l = Math.ceil(1 * 28)*/
                for (let k = 0; k < Math.ceil(Math.random() * 10); k++) {
                    let l = Math.ceil(Math.random() * 28);

                    try {
                        data[date.getFullYear() + i][j + 1][l].push({
                            title:"Frühstück",
                            startTime: "10:00",
                            endTime: "12:00",
                            text: "Some Event Here",
                            link: "https://github.com/nizarmah/calendar-javascript-lib",
                            location:"zu Hause",
                            categorie: "lunch"
                        });
                    } catch (e) {
                        data[date.getFullYear() + i][j + 1][l] = [];
                        data[date.getFullYear() + i][j + 1][l].push({
                            title:"Frühstück",
                            startTime: "10:00",
                            endTime: "12:00",
                            text: "Some Event Here",
                            link: "https://github.com/nizarmah/calendar-javascript-lib",
                            location:"zu Hause",
                            categorie: "lunch"
                        });
                    }
                }
            }
        }

        console.log('data');
        console.log(data);
        return data;
    }
    // function that creates dummy data for demonstration ENDE

    // creating the dummy static data
    let data = createDummyData();

    // initializing a new calendar object, that will use an html container to create itself
    calendar = new Calendar("calendarContainer", // id of html container for calendar
        "small", // size of calendar, can be small | medium | large
        [
            "Wednesday", // left most day of calendar labels
            3 // maximum length of the calendar labels
        ], [
            "#e6e6e6", // primary color
            "#ffffff", // primary dark color
            "#000000", // text color
            "#000000" // text dark color
        ],
        {
            indicator: true,
            indicator_type: 1, // indicator type, can be 0 (not numeric) | 1 (numeric)
            indicator_pos: "bottom" // indicator position, can be top | bottom
        }
    );

    // initializing a new organizer object, that will use an html container to create itself
    //let organizer = new Organizer("organizerContainer", // id of html container for calendar
    organizer = new Organizer("organizerContainer", // id of html container for calendar
        calendar, // defining the calendar that the organizer is related to
        data // giving the organizer the static data that should be displayed
    );

};
