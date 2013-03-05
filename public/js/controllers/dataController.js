App.dataController = (function() {
    var SETS_DATA_READY = 'DATA_CONTROLLER_SETS_DATA_READY';
    var PHOTOS_DATA_READY = 'DATA_CONTROLLER_PHOTOS_DATA_READY';
    var SET_DATA_CREATED = "DATA_CONTROLLER_SET_DATA_CREATED";
    var USER_LOGGED_IN = "DATA_CONTROLLER_USER_LOGGED_IN";
    var USER_LOGIN_FAILED = "DATA_CONTROLLER_USER_LOGIN_FAILED";
    var USER_REGISTERED = "DATA_CONTROLLER_USER_REGISTERED";
    var USER_REGISTRATION_FAILED = "DATA_CONTROLLER_USER_REGISTRATION_FAILED";

    var init = function() {
        _.bindAll(this, 'getSets', 'getPhotos', 'clearPhotos', 'createSet', 'login');
        _.extend(this, Backbone.Events);
    };

    var getSets = function() {
        var self = this;
        App.allSetStore.fetch({
            success: function(collection, response, options) {
                collection.fetched = true;
                self.trigger(SETS_DATA_READY, collection);
            }
        });
    };

    var getPhotos = function(setId) {
        var self = this;
        App.photoStore.setId = setId;
        App.photoStore.fetch({
            success: function(collection, response, options) {
                collection.fetched = true;
                self.trigger(PHOTOS_DATA_READY, collection, setId);
            }
        });
    };

    var clearPhotos = function() {
        App.photoStore.setId = -1;
        App.photoStore.fetched = false;
        App.photoStore.reset();
    };

    var createSet = function(data) {
        var self = this;
        var newSet = new App.models.Set(data);
        App.allSetStore.add(newSet);
        newSet.save(null, {
            success: function(model, response, options) {
                self.trigger(SET_DATA_CREATED, model);
            }
        });

        return newSet;
    };

    var login = function(email, password) {
        var self = this;

        // Setup the variables for the request
        var url = '/login';
        var data = {
            email: email,
            password: password
        };

        // Make the login request
        var loginRequest = $.post(url, data, function(data, textStatus, jqXHR) {
            console.log('Logged in');
            self.trigger(USER_LOGGED_IN, null); // TODO: Should pass back the user object from the API
        });

        // Set an error handler to listen out for incorrect logins
        loginRequest.fail(function() {
            console.log('Login failed');
            self.trigger(USER_LOGIN_FAILED);
        });
    };

    var register = function(email, password, name) {
        var self = this;

        // Setup the variables for the request
        var url = '/user/register';
        var data = {
            email: email,
            password: password,
            name: name
        };

        // Make the login request
        var registerRequest = $.post(url, data, function(data, textStatus, jqXHR) {
            console.log('Regisgtered');
            self.trigger(USER_REGISTERED, null); // TODO: Should pass back the user object from the API
        });

        // Set an error handler to listen out for incorrect logins
        registerRequest.fail(function() {
            console.log('Registration failed');
            self.trigger(USER_REGISTRATION_FAILED);
        });
    };

    return {
        SETS_DATA_READY: SETS_DATA_READY,
        PHOTOS_DATA_READY: PHOTOS_DATA_READY,
        SET_DATA_CREATED: SET_DATA_CREATED,
        USER_LOGGED_IN: USER_LOGGED_IN,
        USER_LOGIN_FAILED: USER_LOGIN_FAILED,
        USER_REGISTERED: USER_REGISTERED,
        USER_REGISTRATION_FAILED: USER_REGISTRATION_FAILED,

        init: init,
        getSets: getSets,
        getPhotos: getPhotos,
        clearPhotos: clearPhotos,
        createSet: createSet,
        register: register,
        login: login
    };

}());
