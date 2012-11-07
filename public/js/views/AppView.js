App.views = App.views || {};

App.views.AppView = Backbone.View.extend({
    template: _.template($('#appViewTemplate').html()),
    
    initialize: function() {
        _.bindAll(this, 'render');
    },

    render: function() {
        return this;
    }
});
