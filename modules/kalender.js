const clickOnTag = {clickOnTag: false};


// /** JS doc comment automatische Anweisung, type over a function "/*" then add an "*" after that a popup appear with JS DOc

/**
 *  Ziel: Baut einen neuen Kalender auf
 * 
 * @param {*} id: id von dem Kalender in index.html
 * @param {*} size: Größe der Kalender small | medium | large
 * @param {*} labelSettings: bestimmt das Layout vom dem Kalender (Tage links angezeigt) und die Maximal Anzahl von Labels
 * @param {*} colors:  Array mit 4 Hex Elementen für die Farben des Kalenderes
 * 
 *                    Beispiel: [
 *                                        "#ffc107", // Hintergrund Farbe für Monat Zeile 
 *                                        "#ffa000", // Hintergrund Farbe für den Tage und Jahr Zeile background color
 *                                        "#000000", // Text Farbe für Monat Zeile
 *                                        "#000000" // Text Farbe für den Tage und Jahr
 *                               ],
 * @param {*} options: Object für die Einstellungen für Termin Indikatoren
 *                               {
 *                                  indicator: true, // Termin Indikator aktivieren (true or false)
 *                                  indicator_type: 1, // Termin Indikator Type, 0 (not numeric) | 1 (numeric)
 *                                  indicator_pos: "bottom" // Termin Indikator Position innerhalb ein Tag,  top | bottom
 *                               }
 *
 *
*/
function Calendar(id, size, labelSettings, colors, options) {
    this.id = id;
    this.size = size;
    this.labelSettings = labelSettings;
    this.colors = colors;

    this.initday = 0;

    options = options || {};

    this.indicator = true;
    if (options.indicator != undefined) this.indicator = options.indicator;

    this.indicator_type = 1;
    if (options.indicator_type != undefined) this.indicator_type = options.indicator_type;

    this.indicator_pos  = (this.indicator_type == 1) ? "bottom" : "top";
    if (options.indicator_pos != undefined) this.indicator_pos = options.indicator_pos;

    let listPlaceholder = document.createElement("LI");
    listPlaceholder.className = "cjslib-list-placeholder";
    listPlaceholder.appendChild(document.createTextNode("No events on this day"));
    listPlaceholder.style = "text-align: center; padding: 20px 0px;";
    
    this.placeholder = listPlaceholder.outerHTML;
    if (options.placeholder != undefined) this.placeholder = options.placeholder;

    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    if (options.months != undefined && options.months.length == 12) months = options.months;

    let label = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    if (options.days != undefined && options.days.length == 7) label = options.days;

    this.months = months;
    this.defaultLabels = label;

    this.label = [];
    this.labels = [];
    for (let i = 0; i < 7; i++) {
        this.label.push(label[label.indexOf(labelSettings[0]) + this.label.length >= label.length ? Math.abs(label.length - (label.indexOf(labelSettings[0]) + this.label.length)) : label.indexOf(labelSettings[0]) + this.label.length]);
    }
    for (let i = 0; i < 7; i++) {
        this.labels.push(this.label[i].substring(0, labelSettings[1] > 3 ? 3 : labelSettings[1]));
    }

    this.date = new Date();
    this.today = new Date();

    this.history = [];

    this.draw();
    this.update();

    // Setzen von Event für alle Tag des Kalenders und Pfeile im Schieberegalen
    this.setOnClickListener('days-blocks');
    this.setOnClickListener('month-slider');
    this.setOnClickListener('year-slider');
}


//Calender START 
Calendar.prototype = {
    constructor: Calendar,
    // Function um den Kalender in die Vergangenheit durchzuqueren
    back: function back(func) {
        let date = this.date;
        let lastDay = new Date(date.getMonth() + 1 > 11 ? date.getFullYear() + 1 : date.getFullYear(), date.getMonth() + 1 > 12 ? 0 : date.getMonth() + 1, 0).getDate();
        let previousLastDay = new Date(date.getMonth() < 0 ? date.getFullYear() - 1 : date.getFullYear(), date.getMonth() < 0 ? 11 : date.getMonth(), 0).getDate();

        if (func == "month") {
            if (date.getDate() > previousLastDay) {
                this.changeDateTo(previousLastDay);
            }
            if (date.getMonth() > 0) date.setMonth(date.getMonth() - 1);else {
                date.setMonth(11);
                date.setFullYear(date.getFullYear() - 1);
            }
        } else if (func == "year") date.setFullYear(date.getFullYear() - 1);

        this.update();
    },

    // Function um den Kalender in die Zukunft durchzuqueren
    next: function next(func) {
        let date = this.date;
        let lastDay = new Date(date.getMonth() + 1 > 11 ? date.getFullYear() + 1 : date.getFullYear(), date.getMonth() + 1 > 12 ? 0 : date.getMonth() + 1, 0).getDate();
        let soonLastDay = new Date(date.getMonth() + 2 > 11 ? date.getFullYear() + 1 : date.getFullYear(), date.getMonth() + 2 > 12 ? 0 : date.getMonth() + 2, 0).getDate();

        if (func == "month") {
            if (date.getDate() > soonLastDay) {
                this.changeDateTo(soonLastDay);
            }
            if (date.getMonth() != 11) date.setMonth(date.getMonth() + 1);else {
                date.setMonth(0);
                date.setFullYear(date.getFullYear() + 1);
            }
        } else date.setFullYear(date.getFullYear() + 1);

        this.update();
    },

    // Function um die aktuelle Datum zu aktualisieren
    changeDateTo: function changeDateTo(theDay, theBlock) {
        if (theBlock >= 31 && theDay <= 11 || theBlock <= 6 && theDay >= 8) {
            if (theBlock >= 31 && theDay <= 11) this.next('month');else if (theBlock <= 6 && theDay >= 8) this.back('month');

            this.date.setDate(theDay);

            let calendarInstance = this;
            setTimeout(function () {
                calendarInstance.update();
            }, 1);

            return true;
        } else this.date.setDate(theDay);
    },


    // Übergibt die Datum des ausgewählt Tag as a String, Monat als Wort dargestellt
    getDateString: function getDateString() {
        return this.months[this.date.getMonth()] + " " + this.date.getDate() + ", " + this.date.getFullYear();
    },

    // Übergibt die Datum des ausgewählt Tag as a String , Monat als Zahl dargestellt
    getDateNumbers: function getDateNumbers() {
        // Addieren von 1 für den Monat, da Januar mit 0 dargestellt ist
        return `${this.date.getDate()}.${(this.date.getMonth() + 1)}.${this.date.getFullYear()}`;
    }
};
//Calender STOP


//draw START
// Stellt den Kalender dar
Calendar.prototype.draw = function () {
    let backSvg = '<svg style="width: 24px; height: 24px;" viewBox="0 0 24 24"><path fill="' + this.colors[3] + '" d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"></path></svg>';
    let nextSvg = '<svg style="width: 24px; height: 24px;" viewBox="0 0 24 24"><path fill="' + this.colors[3] + '" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path></svg>';

    let theCalendar = document.createElement("DIV");
    theCalendar.className = "cjslib-calendar cjslib-size-" + this.size;

    document.getElementById(this.id).appendChild(theCalendar.cloneNode(true));

    let theContainers = [],
        theNames = ['year', 'month', 'labels', 'days'];
    for (let i = 0; i < theNames.length; i++) {
        theContainers[i] = document.createElement("DIV");
        theContainers[i].className = "cjslib-" + theNames[i];

        if (theNames[i] != "days") {
            if (theNames[i] != "month") {
                theContainers[i].style.backgroundColor = this.colors[1];
                theContainers[i].style.color = this.colors[3];

                if (theNames[i] != "labels") {
                    let backSlider = document.createElement("DIV");
                    backSlider.id = this.id + "-year-back";
                    backSlider.insertAdjacentHTML('beforeend', backSvg);
                    theContainers[i].appendChild(backSlider.cloneNode(true));

                    let theText = document.createElement("SPAN");
                    theText.id = this.id + "-" + theNames[i];
                    theContainers[i].appendChild(theText.cloneNode(true));

                    let nextSlider = document.createElement("DIV");
                    nextSlider.id = this.id + "-year-next";
                    nextSlider.insertAdjacentHTML('beforeend', nextSvg);
                    theContainers[i].appendChild(nextSlider.cloneNode(true));
                }
            } else {
                theContainers[i].style.backgroundColor = this.colors[0];
                theContainers[i].style.color = this.colors[2];

                let backSlider = document.createElement("DIV");
                backSlider.id = this.id + "-month-back";
                backSlider.insertAdjacentHTML('beforeend', backSvg);
                theContainers[i].appendChild(backSlider.cloneNode(true));

                let theText = document.createElement("SPAN");
                theText.id = this.id + "-" + theNames[i];
                theContainers[i].appendChild(theText.cloneNode(true));

                let nextSlider = document.createElement("DIV");
                nextSlider.id = this.id + "-month-next";
                nextSlider.insertAdjacentHTML('beforeend', nextSvg);
                theContainers[i].appendChild(nextSlider.cloneNode(true));
            }
        }
    }

    for (let i = 0; i < this.labels.length; i++) {
        let theLabel = document.createElement("SPAN");
        theLabel.id = this.id + "-label-" + (i + 1);
        theLabel.appendChild(document.createTextNode(this.labels[i]).cloneNode(true));

        theContainers[2].appendChild(theLabel.cloneNode(true));
    }

    let theRows = [],
        theDays = [],
        theRadios = [];
    for (let i = 0; i < 6; i++) {
        theRows[i] = document.createElement("DIV");
        theRows[i].className = "cjslib-row";
    }

    for (let i = 0, j = 0; i < 42; i++) {
        theRadios[i] = document.createElement("INPUT");
        theRadios[i].className = "cjslib-day-radios";
        theRadios[i].type = "radio";
        theRadios[i].name = this.id + "-day-radios";
        theRadios[i].id = this.id + "-day-radio-" + (i + 1);

        theDays[i] = document.createElement("LABEL");
        theDays[i].className = "cjslib-day";
        theDays[i].htmlFor = this.id + "-day-radio-" + (i + 1);
        theDays[i].id = this.id + "-day-" + (i + 1);

        let theText = document.createElement("SPAN");
        theText.className = "cjslib-day-num";
        theText.id = this.id + "-day-num-" + (i + 1);

        theDays[i].appendChild(theText.cloneNode(true));

        if (this.indicator) {
            let theIndicator = document.createElement("SPAN");
            theIndicator.className = "cjslib-day-indicator cjslib-indicator-pos-" + this.indicator_pos;
                if (this.indicator_type == 1) theIndicator.className += " cjslib-indicator-type-numeric";
            theIndicator.id = this.id + "-day-indicator-" + (i + 1);

            theDays[i].appendChild(theIndicator.cloneNode(true));
        }

        theRows[j].appendChild(theRadios[i].cloneNode(true));
        theRows[j].appendChild(theDays[i].cloneNode(true));

        if ((i + 1) % 7 == 0) {
            j++;
        }
    }

    for (let i = 0; i < 6; i++) {
        theContainers[3].appendChild(theRows[i].cloneNode(true));
    }

    for (let i = 0; i < theContainers.length; i++) {
        theCalendar.appendChild(theContainers[i].cloneNode(true));
    }

    /* Button für neue Termin hinzufügen*/
    /* Buttton id calendarContainer-btn*/
    let theAppointement = document.createElement("BUTTON");
    theAppointement.id = this.id + "-btn";
    theAppointement.innerHTML = "+";
    theAppointement.className = "cjslib-btn";
    theCalendar.appendChild(theAppointement.cloneNode(true));

    document.getElementById(this.id).innerHTML = "<style>.cjslib-day-indicator { color: " + this.colors[1] + "; background-color: " + this.colors[1] + "; } .cjslib-indicator-type-numeric { color: " + this.colors[2] + "; } .cjslib-day.cjslib-day-today > .cjslib-day-num { border-color: " + this.colors[1] + " !important; }</style>";
    document.getElementById(this.id).appendChild(theCalendar.cloneNode(true));

};
//draw STOP


//update START
// Aktualisiert der Darstellung des Kalenders
Calendar.prototype.update = function () {
    document.getElementById(this.id + '-year').innerHTML = this.date.getFullYear();
    document.getElementById(this.id + '-month').innerHTML = this.months[this.date.getMonth()];

    for (let i = 1; i <= 42; i++) {
        document.getElementById(this.id + '-day-num-' + i).innerHTML = "";
        document.getElementById(this.id + '-day-' + i).className = this.id + " cjslib-day cjslib-day-listed";
    }

    let firstDay = new Date(this.date.getFullYear(), this.date.getMonth(), 1).getDay();
    let lastDay = new Date(this.date.getMonth() + 1 > 11 ? this.date.getFullYear() + 1 : this.date.getFullYear(), this.date.getMonth() + 1 > 12 ? 0 : this.date.getMonth() + 1, 0).getDate();

    let previousLastDay = new Date(this.date.getMonth() < 0 ? this.date.getFullYear() - 1 : this.date.getFullYear(), this.date.getMonth() < 0 ? 11 : this.date.getMonth(), 0).getDate();

    this.initday = this.label.indexOf(this.defaultLabels[firstDay]);

    let firstDayLabel = this.defaultLabels[firstDay];
    let firstDayLabelPos = this.label.indexOf(firstDayLabel);

    for (let i = 0, j = previousLastDay; i < firstDayLabelPos; i++, j--) {
        document.getElementById(this.id + '-day-num-' + (firstDayLabelPos - i)).innerHTML = j;
        document.getElementById(this.id + '-day-' + (firstDayLabelPos - i)).className = this.id + " cjslib-day cjslib-day-diluted";
    }

    for (let i = 1; i <= lastDay; i++) {
        document.getElementById(this.id + '-day-num-' + (firstDayLabelPos + i)).innerHTML = i;

        if (i == this.date.getDate()) document.getElementById(this.id + '-day-radio-' + (firstDayLabelPos + i)).checked = true;

        if (this.date.getMonth() == this.today.getMonth())
            if (i == this.today.getDate()) document.getElementById(this.id + '-day-' + (firstDayLabelPos + i)).className += " cjslib-day-today";
    }

    for (let i = lastDay + 1, j = 1; firstDayLabelPos + i <= 42; i++, j++) {
        document.getElementById(this.id + '-day-num-' + (firstDayLabelPos + i)).innerHTML = j;
        document.getElementById(this.id + '-day-' + (firstDayLabelPos + i)).className = this.id + " cjslib-day cjslib-day-diluted";
    }
};

//update STOP

//setupBlock START
// Setze Ereignis auf Kalender Block mit einer entsprechenden Callback
Calendar.prototype.setupBlock = function (blockId, calendarInstance, callback) {
    document.getElementById(calendarInstance.id + "-day-" + blockId).onclick = function () {
        if (document.getElementById(calendarInstance.id + "-day-num-" + blockId).innerHTML.length > 0) {
            calendarInstance.changeDateTo(document.getElementById(calendarInstance.id + "-day-num-" + blockId).innerHTML, blockId);
            callback();
        }
    };
};
//setupBlock STOP


//setOnClickListener START
// Setze Ereignisse mit Callback auf Kalender Elementen für die Tag, Monat Schiebregal und Jahr Schiebregal
// nach definiert Konfigurationen
Calendar.prototype.setOnClickListener = function (theCase, backCallback, nextCallback) {
    let calendarId = this.id;

    backCallback = backCallback || function () {};
    nextCallback = nextCallback || function () {};

    let calendarInstance = this;

    switch (theCase) {
        case "days-blocks":
            for (let i = 1; i <= 42; i++) {
                calendarInstance.setupBlock(i, calendarInstance, backCallback);
            }
            break;
        case "month-slider":
            document.getElementById(calendarId + "-month-back").onclick = function () {
                calendarInstance.back('month');
                backCallback();
            };
            document.getElementById(calendarId + "-month-next").onclick = function () {
                calendarInstance.next('month');
                nextCallback();
            };
            break;
        case "year-slider":
            document.getElementById(calendarId + "-year-back").onclick = function () {
                calendarInstance.back('year');
                backCallback();
            };
            document.getElementById(calendarId + "-year-next").onclick = function () {
                calendarInstance.next('year');
                nextCallback();
            };
            break;
    }
};
//setOnClickListener STOP



// Organizer START
// Baut ein neue Kalender auf
/**
 * 
 * @param {*} id : id von dem html Container für den Kalendar
 * @param {*} calendar : Verbindung mit dem Kalender für den, der Organizer zuständig ist
 * @param {*} data : Statische Dateien an den Organizer übergeben, die angezeigt werden sollen
 */
function Organizer(id, calendar, data) {
    this.id = id;
    this.calendar = calendar;

    this.data = data || {};

    this.draw();

    let organizerInstance = this;
    organizerInstance.onMonthChange(function () {
        organizerInstance.indicateEvents();
    });

    this.setOnClickListener('days-blocks');
    this.setOnClickListener('day-slider');
    this.setOnClickListener('month-slider');
    this.setOnClickListener('year-slider');

    this.setOnLongClickListener('days-blocks');
}
// Organizer ENDE


// Organizer START
// Organizer Constructor, baut ein neue Kalender Object auf
Organizer.prototype = {
    constructor: Organizer,
    back: function back(func) {
        let date = this.calendar.date;
        let lastDay = new Date(date.getMonth() + 1 > 11 ? date.getFullYear() + 1 : date.getFullYear(), date.getMonth() + 1 > 12 ? 0 : date.getMonth() + 1, 0).getDate();
        let previousLastDay = new Date(date.getMonth() < 0 ? date.getFullYear() - 1 : date.getFullYear(), date.getMonth() < 0 ? 11 : date.getMonth(), 0).getDate();

        if (func == "day") {
            if (date.getDate() != 1) {
                this.changeDateTo(date.getDate() - 1);

                this.update();
            } else {
                this.calendar.back('month');
                this.changeDateTo(lastDay);

                let organizerInstance = this;
                organizerInstance.onMonthChange(function () {
                    organizerInstance.indicateEvents();
                });
            }

            document.getElementById(this.calendar.id + "-day-radio-" + (this.calendar.initday + date.getDate())).checked = true;
        } else {
            this.calendar.back(func);

            let organizerInstance = this;
            organizerInstance.onMonthChange(function () {
                organizerInstance.indicateEvents();
            });
        }
    },
    next: function next(func) {
        let date = this.calendar.date;
        let lastDay = new Date(date.getMonth() + 1 > 11 ? date.getFullYear() + 1 : date.getFullYear(), date.getMonth() + 1 > 12 ? 0 : date.getMonth() + 1, 0).getDate();
        let soonLastDay = new Date(date.getMonth() + 2 > 11 ? date.getFullYear() + 1 : date.getFullYear(), date.getMonth() + 2 > 12 ? 0 : date.getMonth() + 2, 0).getDate();

        if (func == "day") {
            if (date.getDate() != lastDay) {
                date.setDate(date.getDate() + 1);

                this.update();
            } else {
                this.calendar.next('month');
                date.setDate(1);

                let organizerInstance = this;
                organizerInstance.onMonthChange(function () {
                    organizerInstance.indicateEvents();
                });
            }

            document.getElementById(this.calendar.id + "-day-radio-" + (this.calendar.initday + date.getDate())).checked = true;
        } else {
            this.calendar.next(func);

            let organizerInstance = this;
            organizerInstance.onMonthChange(function () {
                organizerInstance.indicateEvents();
            });
        }
    },
    changeDateTo: function changeDateTo(theDay, theBlock) {
        this.clearHistory();

        let changedMonth = this.calendar.changeDateTo(theDay, theBlock);

        let organizerInstance = this;
        setTimeout(function () {
            if (changedMonth) {
                organizerInstance.onMonthChange(function () {
                    organizerInstance.indicateEvents();
                });
            } else organizerInstance.update();
        }, 1);
    },
    addDate: function changeDateTo(theDay, theBlock) {
        this.showHistory();

        let changedMonth = this.calendar.changeDateTo(theDay, theBlock);

        let organizerInstance = this;
        setTimeout(function () {
            if (changedMonth) {
                organizerInstance.onMonthChange(function () {
                    organizerInstance.indicateEvents();
                });
            } else organizerInstance.update();
        }, 1);
    }
};

// Organizer STOP

// draw START
// Stellt den Organizer dar
Organizer.prototype.draw = function () {
    let backSvg = '<svg style="width: 24px; height: 24px;" viewBox="0 0 24 24"><path fill="' + this.calendar.colors[3] + '" d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"></path></svg>';
    let nextSvg = '<svg style="width: 24px; height: 24px;" viewBox="0 0 24 24"><path fill="' + this.calendar.colors[3] + '" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path></svg>';

    let theOrganizer = document.createElement("DIV");
    theOrganizer.className = "cjslib-events cjslib-size-" + this.calendar.size;

    let theDate = document.createElement("DIV");
    theDate.className = "cjslib-date";
    theDate.style.backgroundColor = this.calendar.colors[1];
    theDate.style.color = this.calendar.colors[3];

    let backSlider = document.createElement("DIV");
    backSlider.id = this.id + "-day-back";
    backSlider.insertAdjacentHTML('beforeend', backSvg);
    theDate.appendChild(backSlider.cloneNode(true));

    let theText = document.createElement("SPAN");
    theText.id = this.id + "-date";
    theDate.appendChild(theText.cloneNode(true));

    let nextSlider = document.createElement("DIV");
    nextSlider.id = this.id + "-day-next";
    nextSlider.insertAdjacentHTML('beforeend', nextSvg);
    theDate.appendChild(nextSlider.cloneNode(true));

    let theRows = document.createElement("DIV");
    theRows.className = "cjslib-rows";
    theRows.id = this.id + "-list-container";

    let theList = document.createElement("OL");
    theList.className = "cjslib-list";
    theList.id = this.id + "-list";

    let theHistory = document.createElement("OL");
    theHistory.className = "cjslib-list";
    theHistory.id = this.id + "-history";

    theRows.appendChild(theList.cloneNode(true));
    theRows.appendChild(theHistory.cloneNode(true));

    theOrganizer.appendChild(theDate.cloneNode(true));
    theOrganizer.appendChild(theRows.cloneNode(true));

    document.getElementById(this.id).appendChild(theOrganizer.cloneNode(true));
};
// draw STOP

// update START
// Aktualisert die Darstellung des Organizers
Organizer.prototype.update = function () {
    document.getElementById(this.id + "-date").innerHTML = this.calendar.months[this.calendar.date.getMonth()] + " " + this.calendar.date.getDate() + ", " + this.calendar.date.getFullYear();
    document.getElementById(this.id + "-list").innerHTML = "";

    this.showEvents();
};
// update STOP

// updateData START
// Aktualisert die Darstellung und die Ereignisse des Organizers
Organizer.prototype.updateData = function (data) {
    this.data = data;

    this.indicateEvents();
    this.update();
};
// updateData STOP


// list START
// Listet die verschiedene Termin an einem Tag
Organizer.prototype.list = function (data) {
    /* Create Container für den Termin des Tages*/
    let container = document.createElement("UL");
    for (let i = 0; i < data.length; i++) {
        /* Create List auf Termine für den Tag*/
        let listItem = document.createElement("LI");
        listItem.id = this.id + "-list-item-" + i;


        

        let division = document.createElement("DIV");


        /* Create Title für einen Termine */
        let title = document.createElement("h2");
        title.id = this.id + "-list-item-" + i + "-title";
        title.class = this.id + " title";
        title.appendChild(document.createTextNode(data[i].title + ' : '));
        division.appendChild(title);

        /* Create element für Termin Uhrzeit*/
        let span = document.createElement("SPAN");
        span.id = this.id + "-list-item-" + i + "-time";
        span.class = this.id + " time";
        span.innerHTML = `<span class=bold>Uhrzeit</span>: ${data[i].startTime} - ${data[i].endTime} <br>`;
        //span.appendChild(document.createTextNode(data[i].startTime + ' - ' + data[i].endTime));

        division.appendChild(span);

        let paragraph = document.createElement("P");
        paragraph.id = this.id + "-list-item-" + i + "-text";

       
        let textNode = document.createElement("text");(data[i].text);
        textNode.innerHTML = `<span class=bold>Notizen</span>: ${data[i].text} <br>`;

        paragraph.appendChild(textNode);

         /* Create Ort für einen Termine */
         let location = document.createElement("SPAN");
         location.id = this.id + "-list-item-" + i + "-location";
         location.class = this.id + " location";
         location.innerHTML = `<span class=bold>Ort</span>: ${data[i].location} <br>`;
         //location.appendChild(document.createTextNode(data[i].location + ' <br> '));
         division.appendChild(location);

         /* Baut Kategorie für einen Termine auf*/
         let categorie = document.createElement("SPAN");
         categorie.id = this.id + "-list-item-" + i + "-categorie";
         categorie.class = this.id + " location";
         categorie.innerHTML = `<span class=bold>Kategorie</span>: ${data[i].categorie} <br>`;
         division.appendChild(categorie);

         division.appendChild(paragraph);
         listItem.appendChild(division);
        

        container.appendChild(listItem);
    }

    return container.innerHTML
};
// list STOP


// remember START
Organizer.prototype.remember = function (date, content) {
    if (content.startsWith("<div class=\"cjslib-list-placeholder\">"))
        return "";

    let dateTitle = this.calendar.getDateString();

    console.log('remember');
    console.log(dateTitle);

   
    console.log('dateNumber');
    console.log(dateNumber);

    this.calendar.history.unshift(dateTitle);

    let container = document.createElement("UL");
    container.className = "cjslib-list cjslib-list-history"

    let title = document.createElement("LI");
    title.appendChild(document.createTextNode(dateTitle));
    title.className = "cjslib-list-history-title cjslib-date";
    title.style.backgroundColor = this.calendar.colors[1];
    title.style.color = this.calendar.colors[3];

    container.appendChild(title);

    container.innerHTML += content;

    return container.outerHTML;
};

// remember STOP


// clearHistory START
// löscht die Darstellung der Historie eines Termins
Organizer.prototype.clearHistory = function () {
    this.calendar.history = [];
    document.getElementById(this.id + "-history").innerHTML = "";
}
// clearHistory STOP

// setupBlock START
Organizer.prototype.setupBlock = function (blockId, organizerInstance, callback) {
    let calendarInstance = organizerInstance.calendar;

    document.getElementById(calendarInstance.id + "-day-" + blockId).onclick = function () {
        if (document.getElementById(calendarInstance.id + "-day-num-" + blockId).innerHTML.length > 0) {
            if (document.getElementById(calendarInstance.id + "-day-radio-" + blockId).checked)
                return;

            let longPressed = "" + document.getElementById(calendarInstance.id + "-day-num-" + blockId).dataset.longpressed;
            document.getElementById(calendarInstance.id + "-day-num-" + blockId).dataset.longpressed = false;

            if (longPressed != "true") {
                organizerInstance.changeDateTo(document.getElementById(calendarInstance.id + "-day-num-" + blockId).innerHTML, blockId);
                // Meldet einen Klick on Tag für den Auswahl einer Datum für einen Termin
                clickOnTag.clickOnTag = true;
                callback();
            }
        }
    };
};
// setupBlock STOP

Organizer.prototype.showEvents = function (data) {
    data = data || this.data;
    let date = this.calendar.date;

    let content = "";
    let history = "";
    try {
        let historyIndex = this.calendar.history.indexOf(this.calendar.getDateString());
        if (historyIndex > -1) {
            this.calendar.history.splice(historyIndex, 1);
            document.getElementById(this.id + "-history").children[historyIndex].remove();
        }

        history += 
        history += document.getElementById(this.id + "-list").innerHTML;

        content = this.list(data[date.getFullYear()][date.getMonth() + 1][date.getDate()]);
    } catch (e) {
        content = this.showPlaceholder();
    }

    document.getElementById(this.id + "-list").innerHTML = content;
};

Organizer.prototype.showHistory = function (data) {
    data = data || this.data;
    let date = this.calendar.date;

    let content = this.remember(date, document.getElementById(this.id + "-list").innerHTML);
    let history = document.getElementById(this.id + "-history").innerHTML;

    document.getElementById(this.id + "-history").innerHTML = content + history;
};

Organizer.prototype.showPlaceholder = function (data) {
    let container = document.createElement("DIV");
    container.className = "cjslib-list-placeholder";

    container.innerHTML = this.calendar.placeholder;

    return container.outerHTML;
};

Organizer.prototype.indicateEvents = function (data) {
    data = data || this.data;
    let date = this.calendar.date;

    if (this.calendar.indicator) {
        let allDays = document.getElementsByClassName(this.calendar.id + " cjslib-day cjslib-day-listed");

        for (let i = 0; i < allDays.length; i++) {
            allDays[i].children[1].innerHTML = "";
        }

        try {
            let month = data[date.getFullYear()][date.getMonth() + 1];

            for (let key in month) {
                if (month[key].length > 0)
                    allDays[key - 1].children[1].innerHTML = (month[key].length > 9) ? "9+" : month[key].length;
            }
        } catch (e) {}
    }

    this.update();
};

Organizer.prototype.onMonthChange = function (callback) {
    callback();
};

Organizer.prototype.setOnClickListener = function (theCase, backCallback, nextCallback) {
    let calendarId = this.calendar.id;
    let organizerId = this.id;

    backCallback = backCallback || function () {};
    nextCallback = nextCallback || function () {};

    let organizerInstance = this;

    switch (theCase) {
        case "days-blocks":
            for (let i = 1; i <= 42; i++) {
                organizerInstance.setupBlock(i, organizerInstance, backCallback);
            }
            break;
        case "day-slider":
            document.getElementById(organizerId + "-day-back").onclick = function () {
                organizerInstance.back('day');
                backCallback();
            };
            document.getElementById(organizerId + "-day-next").onclick = function () {
                organizerInstance.next('day');
                nextCallback();
            };
            break;
        case "month-slider":
            document.getElementById(calendarId + "-month-back").onclick = function () {
                organizerInstance.back('month');
                backCallback();
            };
            document.getElementById(calendarId + "-month-next").onclick = function () {
                organizerInstance.next('month');
                nextCallback();
            };
            break;
        case "year-slider":
            document.getElementById(calendarId + "-year-back").onclick = function () {
                organizerInstance.back('year');
                backCallback();
            };
            document.getElementById(calendarId + "-year-next").onclick = function () {
                organizerInstance.next('year');
                nextCallback();
            };
            break;
    }
};

Organizer.prototype.setupLongClickBlock = function (blockId, organizerInstance, callback) {
    let calendarInstance = organizerInstance.calendar;

    let mouseDownEvent = function () {
        document.getElementById(calendarInstance.id + "-day-num-" + blockId).dataset.longpressed = "-";

        window.setTimeout(function () {
            if (document.getElementById(calendarInstance.id + "-day-num-" + blockId).innerHTML.length > 0) {
                if (document.getElementById(calendarInstance.id + "-day-num-" + blockId).dataset.longpressed == "false")
                    return;
                else document.getElementById(calendarInstance.id + "-day-num-" + blockId).dataset.longpressed = true;

                if (document.getElementById(calendarInstance.id + "-day-radio-" + blockId).checked)
                    return;

                organizerInstance.addDate(document.getElementById(calendarInstance.id + "-day-num-" + blockId).innerHTML, blockId);
                callback();
            }
        }, 1000);
    };

    document.getElementById(calendarInstance.id + "-day-" + blockId).onmousedown = mouseDownEvent;
    document.getElementById(calendarInstance.id + "-day-" + blockId).ontouchstart = mouseDownEvent;
};

Organizer.prototype.setOnLongClickListener = function (theCase, backCallback, nextCallback) {
    let calendarId = this.calendar.id;
    let organizerId = this.id;

    backCallback = backCallback || function () {};
    nextCallback = nextCallback || function () {};

    let organizerInstance = this;

    switch (theCase) {
        case "days-blocks":
            for (let i = 1; i <= 42; i++) {
                organizerInstance.setupLongClickBlock(i, organizerInstance, backCallback);
            }
            break;
    }
}
