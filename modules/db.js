// import {set, del, values, keys,  get} from 'https://cdn.jsdelivr.net/npm/idb-keyval@6/+esm';
    
import { set, del, values, keys,  get } from '/modules/idb-keyval/dist/index.js';

export const db = {
    readOne: function (key){
        return get(key);
    },
    readKeys: function (){
        // gibt alle keys als Array zurück
        return keys();
    },
    readDB: function(){
        // gibt alle Values als Array zurück
        return values(); 
    },
    writeDB: function(key,data){

        // schreibt ein key:value Paar in die DB
        return set(key,data);
        
    },
    deleteDB: function(key){
        // löscht ein key:value Paar aus der DB
        del(key);
    },
    updateDB: async function(newItem){

        let key = newItem.id;
        this.writeDB(key,newItem);

    }

};
