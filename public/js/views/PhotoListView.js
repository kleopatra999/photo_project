App.views = App.views || {};

App.views.PhotoListView = Backbone.View.extend({
    template: Handlebars.compile($('#photoListViewTemplate').html()),
    
    initialize: function() {
        _.bindAll(this, 'render');
        this.collection.bind('reset', this.render);
    },

    render: function() {
        var photos = this.collection.toJSON();
        this.$el.html(this.template({
            photos: photos
        }));
        return this;
    }
});
