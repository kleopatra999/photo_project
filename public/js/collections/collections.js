App.collections = {};

App.collections.SetStore = Backbone.Collection.extend({
    model: App.models.Set,
    url: '/set',

    initialize: function() {
    },

    getAll: function() {
        if (this.models.length === 0) {
            return null;
        }

        return this.filter(function(set) {
            return true;
        });
    },

    getById: function(setId) {
        return this.find(function(set) {
            return set.get('id') == setId;
        }); 
    }
});
