App.views = App.views || {};

App.views.SetListView = Backbone.View.extend({
    template: Handlebars.compile($('#setListViewTemplate').html()),

    events: {
        'click .btn.newSet': '_newSetClicked'
    },

    initialize: function() {
        _.bindAll(this, 'render', '_newSetClicked');
        this.collection.bind('reset', this.render);
    },

    render: function() {
        var sets = this.collection.toJSON();
        this.$el.html(this.template({
            sets: sets
        }));
        return this;
    },

    _newSetClicked: function() {
        App.router.navigate('/set/new', {trigger: true});
    }
});

