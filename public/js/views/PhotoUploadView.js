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
        _.bindAll(this, 'render',
                        'newUploadGroup',
                        '_selectClicked',
                        '_handleDragLeave',
                        '_handleDragOver',
                        '_handleDrop',
                        '_handleFileUpload',
                        '_loadFiles',
                        '_createNewPhoto',
                        '_uploadClicked',
                        '_nextUpload',
                        '_uploadComplete');
        this.setCollection = options.setCollection;

        this.collection.bind('reset', this.render);
        this.collection.bind('change', this.render);
        this.collection.bind('add', this.render);
        this.collection.bind('remove', this.render);
        this.setCollection.bind('reset', this.render);

        App.localDataController.bind(App.localDataController.FILE_LOADED, this._createNewPhoto);
    },

    render: function() {
        var self = this;

        // Set the html
        var sets = this.setCollection.toJSON();
        var set = (sets) ? sets[0] : null;
        var photos = this.collection.toJSON();

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

        $(".description").editable(function(value, settings) {
            var $this = $(this);
            var index = $this.parent().attr('data-index');
            var photo = self.collection.at(index);
            photo.set('description', value);

            return value;
        });

        return this;
    },

    newUploadGroup: function() {
        this.uploadGroup = Math.round(Math.random() * 1000000);
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
        var timestamp = Date.parseExact(exif.DateTimeDigitized, "yyyy:MM:dd HH:mm:ss");

        console.log('Upload group', this.uploadGroup);

        var newPhoto = new App.models.Photo({
            setId: this.setCollection.toJSON()[0].id,
            description: file.name,
            date_taken: timestamp.toISOString(),
            upload_group: this.uploadGroup,
            localFile: base64String,
            localFileBlob: file
        });
        this.collection.add(newPhoto);
    },

    _uploadQueue: [],
    _uploadClicked: function() {
        var self = this;

        this.collection.each(function(model) {
            self._uploadQueue.push(model);
        });

        this._nextUpload();
    },
    _nextUpload: function() {
        console.log('_nextUpload', 'Queue length', this._uploadQueue.length);
        if (this._uploadQueue.length > 0) {
            var self = this;

            var model = this._uploadQueue.shift();
            model.save(null, {
                success: self._nextUpload
            });
        }
        else {
            this._uploadComplete();
        }
    },
    _uploadComplete: function() {
        console.log('_uploadComplete', 'Queue length', this._uploadQueue.length);
        var set = this.setCollection.toJSON()[0];

        if (set) {
            App.dataController.clearPhotos();
            App.router.navigate('/set/' + set.id + '/photos', {trigger: true});
        }
        else {
            console.log('We dont have a set...');
        }
    }
});
