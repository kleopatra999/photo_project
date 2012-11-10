App.routers = {};

App.routers.Router = Backbone.Router.extend({
    routes: {
        '': 'showHome',
        'home': 'showHome',
        'set/:setId/photos': 'showPhotoList'
    },
    
    initialize: function (options) {
        _.bindAll(this, 'showHome', '_handleAllSetsData', 'showPhotoList', '_handleAllPhotosData', '_handleAllSetsDataPhoto');
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
    _lastSetId: null,
    showPhotoList: function(setId) {
        this._lastSetId = setId;

        var set = App.allSetStore.getById(setId);
        if (set) {
            if (App.photoStore.length > 0) {
                var photos = App.photoStore.getAll();
                if (photos) {
                    App.selectedSetStore.reset(set);
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
        }
        else {
            App.dataController.bind(App.dataController.SET_DATA_READY, this._handleAllSetsDataPhoto);
            App.dataController.getSets();
        }
    },
    _handleAllPhotosData: function(sets) {
        App.dataController.unbind(App.dataController.PHOTOS_DATA_READY, this._handleAllPhotoData);
        this.showPhotoList(this._lastSetId);
    },
    _handleAllSetsDataPhoto: function(sets) {
        App.dataController.unbind(App.dataController.SET_DATA_READY, this._handleAllSetsDataPhoto);
        this.showPhotoList(this._lastSetId);
    }
});
