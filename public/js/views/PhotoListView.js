App.views = App.views || {};

App.views.PhotoListView = Backbone.View.extend({
    template: Handlebars.compile($('#photoListViewTemplate').html()),
    
    initialize: function(options) {
        _.bindAll(this, 'render');
        this.setCollection = options.setCollection;

        this.collection.bind('reset', this.render);
        this.setCollection.bind('reset', this.render);
    },

    render: function() {
        var sets = this.setCollection.toJSON();
        var set = (sets) ? sets[0] : null;
        var photos = this.collection.toJSON();
        this.$el.html(this.template({
            set: set,
            photos: photos
        }));
        return this;
    }
});
