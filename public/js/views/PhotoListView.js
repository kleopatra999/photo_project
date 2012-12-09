App.views = App.views || {};

App.views.PhotoListView = Backbone.View.extend({
    template: Handlebars.compile($('#photoListViewTemplate').html()),
    $dropzone: null,

    initialize: function(options) {
        _.bindAll(this, 'render', '_handleDragLeave', '_handleDragOver', '_handleDrop');
        this.setCollection = options.setCollection;

        this.collection.bind('reset', this.render);
        this.setCollection.bind('reset', this.render);
    },

    render: function() {
        // Set the html
        var sets = this.setCollection.toJSON();
        var set = (sets) ? sets[0] : null;
        var photos = this.collection.toJSON();
        this.$el.html(this.template({
            set: set,
            photos: photos
        }));

        // Set the drag and drop listeners
        this.$dropzone = this.$el.find('#dropzone');
        var dropzone = this.$dropzone.get(0); // Gets the DOM element from jQuery. Not sure if this is actually quicker
        dropzone.addEventListener('dragleave', this._handleDragLeave, false);
        dropzone.addEventListener('dragover', this._handleDragOver, false);
        dropzone.addEventListener('drop', this._handleDrop, false);

        return this;
    },

    _handleDragLeave: function(evt) {
        evt.stopPropagation();
        evt.preventDefault();

        this.$dropzone.removeClass('dragging');
    },
    _handleDragOver: function(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = "copy";

        this.$dropzone.addClass('dragging');
    },
    _handleDrop: function(evt) {
        evt.stopPropagation();
        evt.preventDefault();

        this.$dropzone.removeClass('dragging');
    }
});
