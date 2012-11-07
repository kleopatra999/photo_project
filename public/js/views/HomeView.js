App.views = App.views || {};

App.views.HomeView = Backbone.View.extend({
    template: _.template('<h1>Testing</h1>'),
    
    initialize: function() {
        _.bindAll(this, 'render');
        this.collection.bind('reset', this.render);
    },

    render: function() {
        this.$el.html(this.template({restaurants: this.collection.toJSON()}));
        return this;
    }
});

