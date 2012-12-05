App.views = App.views || {};

App.views.NewSetView = Backbone.View.extend({
    template: Handlebars.compile($('#newSetViewTemplate').html()),

    initialize: function() {
        _.bindAll(this, 'render');
    },

    render: function() {
        console.log('New set view render');
        this.$el.html(this.template());
        return this;
    }
});

