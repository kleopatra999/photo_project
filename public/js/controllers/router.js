App.routers = {};

App.routers.Router = Backbone.Router.extend({
    routes: {
        '': 'showHome',
        'home': 'showHome',
        'set/:setId/photos': 'showPhotoList'
    },
    
    initialize: function (options) {
        _.bindAll(this, 'showHome', '_handleAllSetsData', 'showPhotoList', '_handleAllPhotosData');
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
            App.dataController.bind(App.dataController.SET_DATA_READY, this._handleAllSetsData);
            App.dataController.getSets();
        }
    },
    _handleAllSetsData: function(sets) {
        App.dataController.unbind(App.dataController.SET_DATA_READY, this._handleAllSetsData);
        this.showHome();
    },

    // Photo list
    showPhotoList: function(setId) {
        if (App.photoStore.length > 0) {
            var photos = App.photoStore.getAll();
            if (photos) {
                App.currentPhotoStore.reset(photos);
                App.viewController.showPhotoListView();
            }
            else {
                alert('No photos');
            }
        }
        else {
            App.dataController.bind(App.dataController.PHOTOS_DATA_READY, this._handleAllPhotosData);
            App.dataController.getPhotos(setId);
        }
    },
    _handleAllPhotosData: function(sets, setId) {
        App.dataController.unbind(App.dataController.PHOTOS_DATA_READY, this._handleAllPhotoData);
        this.showPhotoList(setId);
    }
});
