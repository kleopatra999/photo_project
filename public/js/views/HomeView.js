App.views = App.views || {};

App.views.HomeView = Backbone.View.extend({
    template: Handlebars.compile($('#homeViewTemplate').html()),

    events: {
        'click .btn.login': '_loginClicked',
        'click .btn.register': '_registerClicked'
    },

    initialize: function() {
        _.bindAll(this, 'render', '_loginClicked', '_registerClicked');
    },

    render: function() {
        this.$el.html(this.template());
        return this;
    },

    _loginClicked: function() {
        App.router.navigate('/login', {trigger: true});
    },
    _registerClicked: function() {
        App.router.navigate('/register', {trigger: true});
    }
});
