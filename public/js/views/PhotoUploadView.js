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
                        '_nextUpload');
        this.setCollection = options.setCollection;

        this.collection.bind('reset', this.render);
        this.collection.bind('change', this.render);
        this.collection.bind('add', this.render);
        this.collection.bind('remove', this.render);
        this.setCollection.bind('reset', this.render);
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

        $('.description').editable(function(value, settings) {
            var $this = $(this);
            var index = $this.parent().attr('data-index');
            var photo = self.collection.at(index);
            photo.set('description', value);

            return value;
        });

        $('.date-line').click(this._dateClicked);

        return this;
    },

    newUploadGroup: function() {
        this.uploadGroup = Math.round(Math.random() * 1000000);
    },

    _dateClicked: function() {
        var self = App.photoUploadView;
        var $el = $(this); // this refers to the DOM object clicked
        var modelIndex = $el.parent().attr('data-index');
        var model = self.collection.at(modelIndex);
        console.log(model);

        if ($el.hasClass('active')) {
            return true;
        }
        $el.addClass('active');

        var timestamp = Date.parseExact($el.html(), 'HH:mm:ss dd-MM-yyyy');

        var $datePicker = $('<div class="input-append date" data-date-format="dd-mm-yyyy"><input class="span2" type="text"><span class="add-on"><i class="icon-calendar"></i></span></div>');
        $datePicker.attr('data-date', timestamp.toString('dd-MM-yyyy'));
        $datePicker.find('input').val(timestamp.toString('dd-MM-yyyy'));
        $el.html($datePicker);
        $datePicker.datepicker();

        var $hours = $('<input class="small-number" type="number" id="hours">');
        $hours.val(timestamp.toString('HH'));
        $el.append($hours);

        var $minutes = $('<input class="small-number" type="number" id="minutes">');
        $minutes.val(timestamp.toString('mm'));
        $el.append($minutes);

        var $seconds = $('<input class="small-number" type="number" id="seconds">');
        $seconds.val(timestamp.toString('ss'));
        $el.append($seconds);

        var $okButton = $('<button class="btn">Ok</button>');
        $el.append($okButton);
        $okButton.click(function() {
            $el.removeClass('active');

            var newTimestamp = Date.parse($datePicker.find('input').val());
            newTimestamp.set({
                hour: parseInt($hours.val(), 10),
                minute: parseInt($minutes.val(), 10),
                second: parseInt($seconds.val(), 10)
            });
            model.set('date_taken', newTimestamp.toString('HH:mm:ss dd-MM-yyyy'));

            var set = self.setCollection.toJSON()[0];
            App.router.navigate('/set/' + set.id + '/upload/changeall', {trigger: true});
            App.changeAllDatesView.bind(App.changeAllDatesView.CLICKED, function(props) {
                App.changeAllDatesView.unbind(App.changeAllDatesView.CLICKED);
                App.router.navigate('/set/' + set.id + '/upload', {trigger: true});

                if (props.allPhotos) {
                    var diff = (newTimestamp.getTime() - timestamp.getTime()) / 1000;
                    self.collection.forEach(function(photo) {
                        if (photo !== model) {
                            var currentDateTaken = photo.get('date_taken');
                            var currentDateTakenTimestamp = Date.parseExact(currentDateTaken, 'HH:mm:ss dd-MM-yyyy');
                            currentDateTakenTimestamp.addSeconds(diff);
                            photo.set('date_taken', currentDateTakenTimestamp.toString('HH:mm:ss dd-MM-yyyy'));
                        }
                    });

                }
            });

            self.collection.sort();

            return false;
        });
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

            this._createNewPhoto(file);
        }
    },
    _createNewPhoto: function(file) {
        var newPhoto = new App.models.Photo({
            setId: this.setCollection.toJSON()[0].id,
            description: file.name,
            upload_group: this.uploadGroup,
            localFileBlob: file
        });
        this.collection.add(newPhoto);

        this._uploadQueue.push(newPhoto);
        this._nextUpload();
    },

    _uploadQueue: [],
    _uploadBusy: false,
    _nextUpload: function() {
        console.log('_nextUpload', 'Queue length', this._uploadQueue.length);
        if (this._uploadQueue.length > 0 && !this._uploadBusy) {
            var self = this;
            this._uploadBusy = true;

            var model = this._uploadQueue.shift();
            model.save(null, {
                success: function(model, response, options) {
                    self._uploadBusy = false;
                    self.collection.sort();
                    self._nextUpload();
                }
            });
        }
    },
    _uploadClicked: function() {
        console.log('_uploadComplete', 'Queue length', this._uploadQueue.length);
        var set = this.setCollection.toJSON()[0];

        if (this._uploadQueue.length === 0 && !this._uploadBusy) {
            if (set) {
                App.dataController.clearPhotos();
                App.router.navigate('/set/' + set.id + '/photos', {trigger: true});
            }
            else {
                console.log('We dont have a set...');
            }
        }
        else {
            console.log('Still busy...');
        }
    }
});
