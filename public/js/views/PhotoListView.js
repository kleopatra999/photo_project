App.views = App.views || {};

App.views.PhotoListView = Backbone.View.extend({
    template: Handlebars.compile($('#photoListViewTemplate').html()),

    events: {
        'click #uploadBtn': '_uploadClicked'
    },

    initialize: function(options) {
        _.bindAll(this, 'render', '_uploadClicked');
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
        console.log(this.collection);
        var photos = this.collection.toJSON();
        console.log(photos);
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
    }
});
