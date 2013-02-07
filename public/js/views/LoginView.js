App.views = App.views || {};

App.views.LoginView = Backbone.View.extend({
    template: Handlebars.compile($('#loginViewTemplate').html()),

    events: {
        'click .loginSubmit': '_loginSubmitClicked'
    },

    initialize: function() {
        _.bindAll(this, 'render');
    },

    render: function() {
        this.$el.html(this.template());
        return this;
    },

    _loginSubmitClicked: function() {
        var email = this.$el.find('input#email').val();
        var password = this.$el.find('input#password').val();
        console.log('Should now login...', email, password);
        App.dataController.login(email, password);
        return false;
    }
});

