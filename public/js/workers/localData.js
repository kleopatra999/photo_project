importScripts('../libs/base64.js', '../libs/json2.js', '../libs/binaryajax.js', '../libs/exif.js');

// Setup an event listener that will handle messages sent to the worker
self.addEventListener('message', function(e) {
    var self2 = self;
    // Send the message back
    var file = e.data;

    // Read the file in as a data url
    var reader = new FileReader();
    reader.onload = function(fileEvt) {
        var fileString = fileEvt.target.result;
        var base64String = 'data:image/png;base64,' + base64_encode(fileString);
        var exif = EXIF.readFromBinaryFile(new BinaryFile(fileEvt.target.result));

        self2.postMessage({
            file: file,
            base64String: base64String,
            exif: exif
        });
    };
    reader.readAsBinaryString(file);
}, false);
