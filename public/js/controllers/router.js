App.routers = {};

App.routers.Router = Backbone.Router.extend({
    routes: {
        '': 'showHome',
        'home': 'showHome',
        'set/new': 'showNewSet',
        'set/:setId/photos': 'showPhotoList',
        'set/:setId/upload': 'showPhotoUpload',
        'login': 'showLogin'
    },

    initialize: function (options) {
        _.bindAll(this, 'showHome',
                        '_handleAllSetsData',
                        'showNewSet',
                        'showPhotoList',
                        '_handleAllPhotosData',
                        '_handleAllSetsDataPhoto',
                        'showPhotoUpload',
                        '_handleAllSetsDataPhotoUpload',
                        'showLogin');
    },

    // Home
    showHome: function() {
        if (App.allSetStore.fetched) {
            var sets = App.allSetStore.getAll();
            App.currentSetStore.reset(sets);
            App.viewController.showHomeView();
        }
        else {
            App.dataController.bind(App.dataController.SETS_DATA_READY, this._handleAllSetsData);
            App.dataController.getSets();
        }
    },
    _handleAllSetsData: function(sets) {
        App.dataController.unbind(App.dataController.SETS_DATA_READY, this._handleAllSetsData);
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
            App.dataController.bind(App.dataController.SETS_DATA_READY, this._handleAllSetsDataPhoto);
            App.dataController.getSets();
            return;
        }

        if (App.photoStore.setId != setId || !App.photoStore.fetched) {
            App.dataController.bind(App.dataController.PHOTOS_DATA_READY, this._handleAllPhotosData);
            App.dataController.getPhotos(setId);
            return;
        }

        var photos = App.photoStore.getAll();
        App.selectedSetStore.reset(set);
        App.currentPhotoStore.reset(photos);
        App.viewController.showPhotoListView();
    },
    _handleAllSetsDataPhoto: function(sets) {
        App.dataController.unbind(App.dataController.SETS_DATA_READY, this._handleAllSetsDataPhoto);
        this.showPhotoList(this._lastSetId);
    },
    _handleAllPhotosData: function(sets) {
        App.dataController.unbind(App.dataController.PHOTOS_DATA_READY, this._handleAllPhotoData);
        this.showPhotoList(this._lastSetId);
    },

    // Photo upload
    showPhotoUpload: function(setId) {
        this._lastSetId = setId;

        var set = App.allSetStore.getById(setId);
        if (!set) {
            App.dataController.bind(App.dataController.SETS_DATA_READY, this._handleAllSetsDataPhotoUpload);
            App.dataController.getSets();
            return;
        }

        App.selectedSetStore.reset(set);
        App.currentPhotoStore.reset();
        App.viewController.showPhotoUploadView();
    },
    _handleAllSetsDataPhotoUpload: function(sets) {
        App.dataController.unbind(App.dataController.SETS_DATA_READY, this._handleAllSetsDataPhotoUpload);
        this.showPhotoUpload(this._lastSetId);
    },

    // Login
    showLogin: function() {
        App.loginView.render();
        App.viewController.showLoginView();
    }
});
