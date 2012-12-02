App.collections = {};

App.collections.SetStore = Backbone.Collection.extend({
    model: App.models.Set,
    fetched: false,
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

App.collections.PhotoStore = Backbone.Collection.extend({
    model: App.models.Photo,
    setId: null,
    fetched: false,
    url: function() {
        if (!this.setId) {
            throw "Need to set a setId on the collection before fetching";
        }
        return '/photo?set_id=' + this.setId;
    },

    initialize: function() {
    },

    getAll: function() {
        if (this.models.length === 0) {
            return null;
        }

        return this.filter(function(set) {
            return true;
        });
    }
});
