App.localDataController = (function() {
    // Constants for the events
    var FILE_LOADED = "LOCAL_DATA_FILE_LOADED";

    var controller;
    var worker = new Worker('js/workers/localData.js');
    var queue = [];
    var waitingForWorker = false;

    // Initializes the controller
    var init = function() {
        _.bindAll(this, '_startWorkerIfIdle', '_workerReturn', '_workerError');
        _.extend(this, Backbone.Events);

        // Keep a reference to this for the worker returns
        controller = this;

        worker.addEventListener('message', _workerReturn, false);
        worker.addEventListener('error', _workerError, false);
    };

    // Takes a file and adds it to the processing queue
    var addToQueue = function(file) {
        console.log("Added to queue", file);
        queue.push(file);

        this._startWorkerIfIdle();
    };

    var _startWorkerIfIdle = function() {
        console.log("Checking if we can start");
        if (!waitingForWorker && queue.length > 0) {
            console.log("Starting");
            waitingForWorker = true;
            var file = queue.pop();
            worker.postMessage(file);
        }
        else {
            console.log("Nothing to start", waitingForWorker, queue);
        }
    };

    var _workerReturn = function(evt) {
        waitingForWorker = false;
        var data = evt.data;

        var tempImg = new Image();
        tempImg.src = data.base64String;
        tempImg.onload = function() {
            console.log("Temp image loaded");
            var MAX_WIDTH = 400;
            var MAX_HEIGHT = 300;
            var tempW = tempImg.width;
            var tempH = tempImg.height;
            if (tempW > tempH) {
                if (tempW > MAX_WIDTH) {
                   tempH *= MAX_WIDTH / tempW;
                   tempW = MAX_WIDTH;
                }
            }
            else {
                if (tempH > MAX_HEIGHT) {
                   tempW *= MAX_HEIGHT / tempH;
                   tempH = MAX_HEIGHT;
                }
            }
              
            var canvas = document.createElement('canvas');
            canvas.width = tempW;
            canvas.height = tempH;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(this, 0, 0, tempW, tempH);
            var dataURL = canvas.toDataURL("image/jpeg");

            controller.trigger(FILE_LOADED, data.file, dataURL, data.exif);

            _startWorkerIfIdle();
        };
    };

    var _workerError = function(error) {
        waitingForWorker = false;
        console.log("Worker errored:", error);

        _startWorkerIfIdle();
    };


    // The public declaration
    return {
        FILE_LOADED: FILE_LOADED,

        init: init,
        addToQueue: addToQueue,

        _startWorkerIfIdle: _startWorkerIfIdle,
        _workerReturn: _workerReturn,
        _workerError: _workerError
    };
}());
