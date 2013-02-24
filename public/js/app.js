App = {};

App.appController = (function() {
    var init = function() {
        _.extend(this, Backbone.Events);

        // Check for the various File API support.
        if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
            alert('The File APIs are not fully supported in this browser. You cannot use Shoto :\'(');
            return;
        }

        // Add a new handlebars helper to allow us to get the index while iterating
        //   http://rockycode.com/blog/handlebars-loop-index/
        Handlebars.registerHelper('iter', function(context, options) {
            var fn = options.fn, inverse = options.inverse;
            var ret = "";

            if (context && context.length > 0) {
                for (var i=0, j=context.length; i<j; i++) {
                    ret = ret + fn(_.extend({}, context[i], { i: i, iPlus1: i + 1 }));
                }
            }
            else {
                ret = inverse(this);
            }
            return ret;
        });

        // Set up our stores
        App.allSetStore = new App.collections.SetStore();
        App.currentSetStore = new App.collections.SetStore();
        App.selectedSetStore = new App.collections.SetStore();
        App.photoStore = new App.collections.PhotoStore();
        App.currentPhotoStore = new App.collections.PhotoStore();

        // Initialise our controllers
        App.dataController.init();
        App.localDataController.init();
        App.viewController.init();

        // Create our views
        App.homeView = new App.views.HomeView({
            el: $('#homeView'),
            model: App.models.Set,
            collection: App.currentSetStore
        });
        App.newSetView = new App.views.NewSetView({
            el: $('#newSetView')
        });
        App.photoListView = new App.views.PhotoListView({
            collection: App.currentPhotoStore,
            setCollection: App.selectedSetStore,
            el: $('#photoListView'),
            model: App.models.Photo
        });
        App.photoUploadView = new App.views.PhotoUploadView({
            collection: App.currentPhotoStore,
            setCollection: App.selectedSetStore,
            el: $('#photoUploadView'),
            model: App.models.Photo
        });
        App.loginView = new App.views.LoginView({
            el: $('#loginView')
        });
        App.changeAllDatesView = new App.views.ChangeAllDatesView({
            el: $('#changeAllDatesView')
        });

        // Create the router
        App.router = new App.routers.Router();

        // And start Backbone history
        Backbone.history.start();

        // Setup a listener which will redirect to the login page whenever it gets an unauthorized request
        $(document).ajaxError(function(event, request, settings) {
            if (request.status === 401) {
                App.router.navigate('/login', {trigger: true});
            }
        });
    };

    return {
        init : init
    };
}());
