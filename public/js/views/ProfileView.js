App.views = App.views || {};

App.views.ProfileView = Backbone.View.extend({
    RENDER: "ProfileView.RENDER",
    template: Handlebars.compile($('#profileViewTemplate').html()),

    events: {
        'click #albums': '_albumsClicked'
    },

    initialize: function() {
        _.bindAll(this, 'render', '_albumsClicked');
    },

    render: function() {
        this.trigger(this.RENDER);
        console.log('Render profile');
        this.$el.html(this.template({
            gravatar: get_gravatar(App.user.email, 22)
        }));
        return this;
    },

    _albumsClicked: function() {
        App.router.navigate('/set', {trigger: true});
    }
});
