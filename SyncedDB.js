// In the following line, you should include the prefixes of implementations you want to test.
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
// DON'T use "var indexedDB = ..." if you're not in a function.
// Moreover, you may need references to some window.IDB* objects:
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
// (Mozilla has never prefixed these objects, so we don't need window.mozIDB*)


//SyncDB defaults
SyncedDB.default_db_name = "__synceddb__";
SyncedDB.version = 1;

SyncedDB.INSERT = 1;
SyncedDB.DELETE = 2;
SyncedDB.UPDATE = 3;

/*
Site details
*/
SyncedDB.site_db_name = null;
SyncedDB.site_version = null;
SyncedDB.syncURL = null;

//db of SyncedDB lib
SyncedDB.db = null;

SyncedDB.init = function (dbName, version, syncURL) {
    SyncedDB.site_db_name = dbName;
    SyncedDB.site_version = version;
    SyncedDB.syncURL = syncURL;
    
    var returnVal = {};
    
    var openRequest = window.indexedDB.open (SyncedDB.default_db_name, SyncedDB.version);
    
    openRequest.onupgradeneeded = function(event) { 
      var db = event.target.result;
      // Create an objectStore for this database
      var objectStore1 = db.createObjectStore("dataversion",  { autoIncrement : true });
      var objectStore2 = db.createObjectStore("unsynced", { autoIncrement : true });
    };
    
    openRequest.onsuccess = function (event) {
        var db = event.target.result;
        
        if(returnVal.onsuccess) {
            returnVal.onsuccess(event);
        }
    };
    
    openRequest.onerror = function (event) {
        //TODO: perform something on error
        if(returnVal.onerror) {
            returnVal.onerror(event);
        }
    };
    
    return returnVal;
};



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


SyncedDB.TransactionObject= function (store, action, data) {
        this.version = SyncedDB.site_version;
        this.store = store;
        this.action = action;
        this.data = data;
};

SyncedDB.record = function(data) {
    var returnVal = {};
    var db = SyncedDB.db;
    var trans = db.transaction([unsynced], "readwrite");
    var store = trans.objectStore(unsynced);
    var request = store.put(data);

    request.onsuccess = function(e) {
        if(returnVal.onsuccess) {
            returnVal.onsuccess(e);
        }
    };

    request.onerror = function(e) {
        console.log(e.value);
        if(returnVal.onerror) {
            returnVal.onerror(e);
        }
    };
    return returnVal();
};

SyncedDB.put = function(store, data) {
    var tranObj = new TransactionObject(store, SyncedDB.INSERT, data);
    return record(data);
};

SyncedDB.delete = function(store, data) { 
    var tranObj = new TransactionObject(store, SyncedDB.DELETE, data);
    return record(data);
};

SyncedDB.update = function(store, data) {
    var tranObj = new TransactionObject(store, SyncedDB.UPDATE, data);
    return record(data);
};
