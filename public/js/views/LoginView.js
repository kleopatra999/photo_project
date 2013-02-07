App.views = App.views || {};

App.views.LoginView = Backbone.View.extend({
    template: Handlebars.compile($('#loginViewTemplate').html()),

    initialize: function() {
        _.bindAll(this, 'render');
    },

    render: function() {
        this.$el.html(this.template());
        return this;
    }
});

