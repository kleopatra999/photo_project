App = {};

App.appController = (function() {
    var init = function() {
        _.extend(this, Backbone.Events);

        // Set up our stores
        App.allSetStore = new App.collections.SetStore();
        App.currentSetStore = new App.collections.SetStore();
        App.photoStore = new App.collections.PhotoStore();
        App.currentPhotoStore = new App.collections.PhotoStore();

        // Initialise our controllers
        App.viewController.init();
        App.dataController.init();

        // Create our views
        App.homeView = new App.views.HomeView({
            el: $('#homeView'),
            model: App.models.Set,
            collection: App.currentSetStore
        });

        // Create the router
        App.router = new App.routers.Router();

        // And start Backbone history
        Backbone.history.start();
    };

    return {
        init : init
    };
}());
