App.views = App.views || {};

App.views.PhotoAlignView = Backbone.View.extend({
    setId: -1,
    template: Handlebars.compile($('#photoAlignViewTemplate').html()),

    events: {
        'click #doneBtn': '_doneClicked'
    },

    initialize: function() {
        _.bindAll(this, 'render', '_doneClicked');
    },

    render: function() {
        this.$el.html(this.template());
        return this;
    },

    _doneClicked: function() {
        App.router.navigate('/set/' + this.setId + '/photos', {trigger: true});
    }
});

