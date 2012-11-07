App.routers = {};

App.routers.Router = Backbone.Router.extend({
    routes: {
        '': 'showHome',
        '/home': 'showHome'
    },
    
    initialize: function (options) {
        _.bindAll(this, 'showHome', '_handleAllSetsDataHome');
    },
    
    // Home
    showHome: function() {
        if (App.allSetStore.length > 0) {
            var sets = App.allSetStore.getAll();
            if (sets) {
                App.currentSetStore.reset(sets);
                App.viewController.showHomeView();
            }
            else {
                alert('No sets');
            }
        }
        else {
            App.dataController.bind(App.dataController.SET_DATA_READY, this._handleAllSetsDataHome);
            App.dataController.getSets();
        }
    },
    _handleAllSetsDataHome: function(sets) {
        App.dataController.unbind(App.dataController.SET_DATA_READY, this._handleAllSetsDataHome);
        this.showHome();
    }
});
