App.views = App.views || {};

App.views.PhotoUploadView = Backbone.View.extend({
    template: Handlebars.compile($('#photoUploadViewTemplate').html()),
    $dropzone: null,
    $fileUpload: null,

    events: {
        'click #selectBtn': '_selectClicked',
        'click #uploadBtn': '_uploadClicked'
    },

    initialize: function(options) {
        _.bindAll(this, 'render', '_selectClicked', '_handleDragLeave', '_handleDragOver', '_handleDrop', '_handleFileUpload', '_loadFiles', '_createNewPhoto', '_uploadClicked', '_uploadComplete');
        this.setCollection = options.setCollection;

        this.collection.bind('reset', this.render);
        this.collection.bind('change', this.render);
        this.collection.bind('add', this.render);
        this.collection.bind('remove', this.render);
        this.setCollection.bind('reset', this.render);

        App.localDataController.bind(App.localDataController.FILE_LOADED, this._createNewPhoto);
    },

    render: function() {
        // Set the html
        var sets = this.setCollection.toJSON();
        var set = (sets) ? sets[0] : null;
        var photos = this.collection.toJSON();

        // Sort the photos by the timestamp in the EXIF metadata
        photos = _.sortBy(photos, function(photo) {
            return photo.date_taken;
        });

        this.$el.html(this.template({
            set: set,
            photos: photos
        }));

        // Set the drag and drop listeners
        this.$dropzone = this.$el.find('#dropzone');
        var dropzone = this.$dropzone.get(0); // Gets the DOM element from jQuery. Not sure if this is actually quicker
        dropzone.addEventListener('dragleave', this._handleDragLeave, false);
        dropzone.addEventListener('dragover', this._handleDragOver, false);
        dropzone.addEventListener('drop', this._handleDrop, false);

        // Set the listeners for the manual file upload
        this.$fileUpload = this.$el.find('#fileUpload');
        var fileUpload = this.$fileUpload.get(0);
        fileUpload.addEventListener('change', this._handleFileUpload, false);

        return this;
    },

    _selectClicked: function() {
        this.$fileUpload.click();
    },

    _handleDragLeave: function(evt) {
        evt.stopPropagation();
        evt.preventDefault();

        this.$dropzone.removeClass('dragging');
    },
    _handleDragOver: function(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = "copy";

        this.$dropzone.addClass('dragging');
    },
    _handleDrop: function(evt) {
        evt.stopPropagation();
        evt.preventDefault();

        this.$dropzone.removeClass('dragging');

        var files = evt.dataTransfer.files; // FileList object
        this._loadFiles(files);
    },
    _handleFileUpload: function(evt) {
        var files = evt.target.files; // FileList object
        this._loadFiles(files);
    },
    _loadFiles: function(files) {
        // Loop through the FileList and render image files as thumbnails.
        var file;
        for (var i = 0; i < files.length; i++) {
            file = files[i];

            // Only process image files.
            if (!file.type.match('image/jpeg')) {
                console.log("Ignoring:", file);
                continue;
            }

            App.localDataController.addToQueue(file);
        }
    },
    _createNewPhoto: function(file, base64String, exif) {
        var self = this;

        console.log(exif.DateTimeDigitized);
        var timestamp = Date.parseExact(exif.DateTimeDigitized, "yyyy:MM:dd HH:mm:ss");
        console.log(timestamp);
        
        var newPhoto = new App.models.Photo({
            setId: this.setCollection.toJSON()[0].id,
            description: file.name,
            date_taken: timestamp,
            localFile: base64String,
            localFileBlob: file
        });
        this.collection.add(newPhoto);
    },

    _expectedUploads: 0,
    _returnedUploads: 0,
    _uploadClicked: function() {
        var self = this;

        self._expectedUploads = this.collection.length;
        self._returnedUploads = 0;

        this.collection.each(function(model) {
            model.save(null, {
                success: self._uploadComplete
            });
        });
    },
    _uploadComplete: function() {
        this._returnedUploads++;

        if (self._returnedUploads == self._expectedUploads) {
             var set = this.setCollection.toJSON()[0];

            if (set) {
                App.router.navigate('/set/' + set.id + '/photos', {trigger: true});
            }
            else {
                console.log('We dont have a set...');
            }
        }
    }
});
