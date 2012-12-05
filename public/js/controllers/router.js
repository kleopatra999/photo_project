App.routers = {};

App.routers.Router = Backbone.Router.extend({
    routes: {
        '': 'showHome',
        'home': 'showHome',
        'set/new': 'showNewSet',
        'set/:setId/photos': 'showPhotoList'
    },

    initialize: function (options) {
        _.bindAll(this, 'showHome', '_handleAllSetsData', 'showNewSet', 'showPhotoList', '_handleAllPhotosData', '_handleAllSetsDataPhoto');
    },

    // Home
    showHome: function() {
        if (App.allSetStore.fetched) {
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

    // New Set
    showNewSet: function() {
        App.newSetView.render();
        App.viewController.showNewSetView();
    },

    // Photo list
    _lastSetId: null,
    showPhotoList: function(setId) {
        this._lastSetId = setId;

        var set = App.allSetStore.getById(setId);
        if (!set) {
            App.dataController.bind(App.dataController.SET_DATA_READY, this._handleAllSetsDataPhoto);
            App.dataController.getSets();
            return;
        }

        if (App.photoStore.setId != setId || !App.photoStore.fetched) {
            App.dataController.bind(App.dataController.PHOTOS_DATA_READY, this._handleAllPhotosData);
            App.dataController.getPhotos(setId);
            return;
        }

        var photos = App.photoStore.getAll();
        if (photos) {
            App.selectedSetStore.reset(set);
            App.currentPhotoStore.reset(photos);
            App.viewController.showPhotoListView();
        }
        else {
            alert('No photos');
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
