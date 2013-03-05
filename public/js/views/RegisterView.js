App.views = App.views || {};

// TODO: Should have some form of loading indication
App.views.RegisterView = Backbone.View.extend({
    template: Handlebars.compile($('#registerViewTemplate').html()),

    events: {
        'click #registerSubmit': '_registerSubmitClicked'
    },

    initialize: function() {
        _.bindAll(this, 'render', '_registerSubmitClicked');
    },

    render: function() {
        this.$el.html(this.template());
        return this;
    },

    _registerSubmitClicked: function() {
        // Get the user details
        var email = this.$el.find('input#email').val();
        var password = this.$el.find('input#password').val();
        var name = this.$el.find('input#name').val();

        // Register for callbacks from the data controller
        App.dataController.bind(App.dataController.USER_REGISTERED, this._registrationComplete);
        App.dataController.bind(App.dataController.USER_REGISTRATION_FAILED, this._registrationFailed);

        // Make the request
        App.dataController.register(email, password, name);

        // Return false to keep us on the same page
        return false;
    },
    _registrationComplete: function(user) {
        console.log('Registration complete');
        App.router.navigate('/', {trigger: true});
    },
    _registrationFailed: function() {
        console.log('Registration failed');
    }
});
