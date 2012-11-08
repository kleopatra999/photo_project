App.views = App.views || {};

App.views.HomeView = Backbone.View.extend({
    template: Handlebars.compile($('#homeViewTemplate').html()),
    
    initialize: function() {
        _.bindAll(this, 'render');
        this.collection.bind('reset', this.render);
    },

    render: function() {
        var sets = this.collection.toJSON();
        this.$el.html(this.template({
            sets: sets
        }));
        return this;
    }
});

