App.views = App.views || {};

App.views.PhotoListView = Backbone.View.extend({
    template: Handlebars.compile($('#photoListViewTemplate').html()),

    events: {
        'click #uploadBtn': '_uploadClicked',
        'click #alignBtn': '_alignClicked',
        'click #shareBtn': '_shareClicked'
    },

    initialize: function(options) {
        _.bindAll(this, 'render', '_uploadClicked', '_shareClicked', '_alignClicked');
        this.setCollection = options.setCollection;

        this.collection.bind('reset', this.render);
        this.collection.bind('change', this.render);
        this.collection.bind('add', this.render);
        this.collection.bind('remove', this.render);
        this.setCollection.bind('reset', this.render);

        App.localDataController.bind(App.localDataController.FILE_LOADED, this._saveNewPhoto);
    },

    render: function() {
        // Set the html
        var sets = this.setCollection.toJSON();
        var set = (sets) ? sets[0] : null;
        var photos = this.collection.toJSON();
        this.$el.html(this.template({
            set: set,
            photos: photos
        }));

        return this;
    },

    _uploadClicked: function() {
        var set = this.setCollection.toJSON()[0];

        if (set) {
            App.router.navigate('/set/' + set.id + '/upload', {trigger: true});
        }
        else {
            console.log('We dont have a set...');
        }
    },

    _shareClicked: function() {
        var set = this.setCollection.toJSON()[0];

        if (set) {
            App.router.navigate('/set/' + set.id + '/share', {trigger: true});
        }
        else {
            console.log('We dont have a set...');
        }
    },

    _alignClicked: function() {
        var set = this.setCollection.toJSON()[0];

        if (set) {
            App.router.navigate('/set/' + set.id + '/align', {trigger: true});
        }
        else {
            console.log('We dont have a set...');
        }
    }
});
