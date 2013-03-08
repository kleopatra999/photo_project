App.views = App.views || {};

App.views.HomeView = Backbone.View.extend({
    template: Handlebars.compile($('#homeViewTemplate').html()),

    events: {
        'click .btn.login': '_loginClicked',
        'click .btn.register': '_registerClicked'
    },

    initialize: function() {
        _.bindAll(this, 'render', '_loginClicked', '_registerClicked');

        App.profileView.bind(App.profileView.RENDER, this.render);
    },

    render: function() {
        console.log('Render home');
        var showButtons = (App.user) ? false : true;
        this.$el.html(this.template({
            showButtons: showButtons
        }));
        return this;
    },

    _loginClicked: function() {
        App.router.navigate('/login', {trigger: true});
    },
    _registerClicked: function() {
        App.router.navigate('/register', {trigger: true});
    }
});
