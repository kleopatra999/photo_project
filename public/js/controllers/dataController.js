App.dataController = (function() {
    var SET_DATA_READY = 'DATA_CONTROLLER_SETS_DATA_READY';
    var PHOTOS_DATA_READY = 'DATA_CONTROLLER_PHOTOS_DATA_READY';

    var init = function() {
        _.bindAll(this, 'getSets', 'getPhotos');
        _.extend(this, Backbone.Events);
    };

    var getSets = function() {
        var self = this;
        App.allSetStore.fetch({
            success: function(collection, response, options) {
                self.trigger(SET_DATA_READY, collection);
            }
        });
    };

    var getPhotos = function(setId) {
        var self = this;
        App.photoStore.setId = setId;
        App.photoStore.fetch({
            success: function(collection, response, options) {
                self.trigger(PHOTOS_DATA_READY, collection, setId);
            }
        });
    };

    return {
        SET_DATA_READY: SET_DATA_READY,
        PHOTOS_DATA_READY: PHOTOS_DATA_READY,

        init: init,
        getSets: getSets,
        getPhotos: getPhotos
    };

}());
