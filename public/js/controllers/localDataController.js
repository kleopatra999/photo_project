App.localDataController = (function() {
    // Constants for the events
    var FILE_LOADED = "LOCAL_DATA_FILE_LOADED";

    var controller;
    var worker = new Worker('js/workers/localData.js');

    // Initializes the controller
    var init = function() {
        _.bindAll(this, '_workerReturn', '_workerError');
        _.extend(this, Backbone.Events);

        // Keep a reference to this for the worker returns
        controller = this;

        worker.addEventListener('message', _workerReturn, false);
        worker.addEventListener('error', _workerError, false);
    };

    // Takes a file and adds it to the processing queue
    var addToQueue = function(file) {
        console.log("Added to queue", file);
        worker.postMessage(file);
    };

    var _workerReturn = function(evt) {
        var data = evt.data;
        console.log(evt);
        console.log("Worker returned", data);
        controller.trigger(FILE_LOADED, data.file, data.base64String, data.exif);
    };

    var _workerError = function(error) {
        console.log("Worker errored:", error);
    };


    // The public declaration
    return {
        FILE_LOADED: FILE_LOADED,

        init: init,
        addToQueue: addToQueue,

        _workerReturn: _workerReturn,
        _workerError: _workerError
    };
}());
