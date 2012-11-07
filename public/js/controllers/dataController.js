App.dataController = (function() {
    var SET_DATA_READY = 'DATA_CONTROLLER_SETS_DATA_READY';

    var init = function() {
        _.bindAll(this, 'getSets');
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

    return {
        SET_DATA_READY: SET_DATA_READY,

        init: init,
        getSets: getSets
    };

}());
