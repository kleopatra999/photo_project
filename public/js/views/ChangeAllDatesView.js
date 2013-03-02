App.views = App.views || {};

App.views.ChangeAllDatesView = Backbone.View.extend({
    CLICKED: 'ChangeAllDatesView.CLICKED',

    template: Handlebars.compile($('#changeAllDatesViewTemplate').html()),

    events: {
        'click #single': '_clickedSingle',
        'click #all': '_clickedAll'
    },

    initialize: function() {
        _.bindAll(this, 'render', '_clickedSingle', '_clickedAll');
    },

    render: function() {
        this.$el.html(this.template());
        return this;
    },

    _clickedSingle: function() {
        this.trigger(this.CLICKED, {allPhotos: false});
        return false;
    },
    _clickedAll: function() {
        this.trigger(this.CLICKED,  {allPhotos: true});
        return false;
    }
});
