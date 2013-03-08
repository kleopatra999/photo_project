App.views = App.views || {};

App.views.ProfileView = Backbone.View.extend({
    template: Handlebars.compile($('#profileViewTemplate').html()),

    initialize: function() {
        _.bindAll(this, 'render');
    },

    render: function() {
        this.$el.html(this.template({
            gravatar: get_gravatar(App.user.email, 22)
        }));
        return this;
    }
});
