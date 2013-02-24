App.views = App.views || {};

App.views.ChangeAllDatesView = Backbone.View.extend({
    template: Handlebars.compile($('#changeAllDatesViewTemplate').html()),

    events: {
    },

    initialize: function() {
        _.bindAll(this, 'render');
    },

    render: function() {
        this.$el.html(this.template());
        return this;
    }
});
