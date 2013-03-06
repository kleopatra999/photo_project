App.routers = {};

App.routers.Router = Backbone.Router.extend({
    routes: {
        'set': 'showSetList',
        'set/new': 'showNewSet',
        'set/:setId/photos': 'showPhotoList',
        'set/:setId/upload': 'showPhotoUpload',
        'login': 'showLogin',
        'register': 'showRegister',
        'set/:setId/upload/changeall': 'showChangeAllDates'
    },

    initialize: function (options) {
        _.bindAll(this, 'showSetList',
                        '_handleAllSetsData',
                        'showNewSet',
                        'showPhotoList',
                        '_handleAllPhotosData',
                        '_handleAllSetsDataPhoto',
                        'showPhotoUpload',
                        '_handleAllSetsDataPhotoUpload',
                        'showLogin',
                        'showRegister',
                        'showChangeAllDates');
    },

    // Home
    showSetList: function() {
        App.selectedSetStore.uploadSetId = null;
        if (App.allSetStore.fetched) {
            var sets = App.allSetStore.getAll();
            App.currentSetStore.reset(sets);
            App.viewController.showSetListView();
        }
        else {
            App.dataController.bind(App.dataController.SETS_DATA_READY, this._handleAllSetsData);
            App.dataController.getSets();
        }
    },
    _handleAllSetsData: function(sets) {
        App.dataController.unbind(App.dataController.SETS_DATA_READY, this._handleAllSetsData);
        this.showSetList();
    },

    // New Set
    showNewSet: function() {
        App.selectedSetStore.uploadSetId = null;
        App.newSetView.render();
        App.viewController.showNewSetView();
    },

    // Photo list
    _lastSetId: null,
    showPhotoList: function(setId) {
        App.selectedSetStore.uploadSetId = null;
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

        if (App.selectedSetStore.uploadSetId != setId) {
            App.selectedSetStore.reset(set);
            App.currentPhotoStore.reset();
            App.photoUploadView.newUploadGroup();
        }
        App.selectedSetStore.uploadSetId = setId;
        App.viewController.showPhotoUploadView();
    },
    _handleAllSetsDataPhotoUpload: function(sets) {
        App.dataController.unbind(App.dataController.SETS_DATA_READY, this._handleAllSetsDataPhotoUpload);
        this.showPhotoUpload(this._lastSetId);
    },

    // Login
    showLogin: function() {
        App.selectedSetStore.uploadSetId = null;
        App.loginView.render();
        App.viewController.showLoginView();
    },

    showRegister: function() {
        App.registerView.render();
        App.viewController.showRegisterView();
    },

    showChangeAllDates: function() {
        App.changeAllDatesView.render();
        App.viewController.showChangeAllDatesView();
    }
});
