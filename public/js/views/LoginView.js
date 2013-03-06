App.views = App.views || {};

// TODO: Should have some form of loading indication
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
        // Get the user details
        var email = this.$el.find('input#email').val();
        var password = this.$el.find('input#password').val();

        // Register for callbacks from the data controller
        App.dataController.bind(App.dataController.USER_LOGGED_IN, this._loginComplete);
        App.dataController.bind(App.dataController.USER_LOGIN_FAILED, this._loginFailed);

        // Make the request
        App.dataController.login(email, password);

        // Return false to keep us on the same page
        return false;
    },
    _loginComplete: function(user) {
        console.log('View login complete');
        App.router.navigate('/set', {trigger: true});
    },
    _loginFailed: function() {
        console.log('View login failed');
    }
});

