App.dataController = (function() {
    var SETS_DATA_READY = 'DATA_CONTROLLER_SETS_DATA_READY';
    var PHOTOS_DATA_READY = 'DATA_CONTROLLER_PHOTOS_DATA_READY';
    var SET_DATA_CREATED = "DATA_CONTROLLER_SET_DATA_CREATED";

    var init = function() {
        _.bindAll(this, 'getSets', 'getPhotos', 'createSet');
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

    var createSet = function(data) {
        var self = this;
        var newSet = new App.models.Set(data);
        App.allSetStore.add(newSet);
        newSet.save(null, {
            success: function(model, response, options) {
                console.log('New set created');
                self.trigger(SET_DATA_CREATED, model);
            }
        });

        return newSet;
    };

    return {
        SETS_DATA_READY: SETS_DATA_READY,
        PHOTOS_DATA_READY: PHOTOS_DATA_READY,
        SET_DATA_CREATED: SET_DATA_CREATED,

        init: init,
        getSets: getSets,
        getPhotos: getPhotos,
        createSet: createSet
    };

}());
