App.views = App.views || {};

App.views.PhotoAlignView = Backbone.View.extend({
    template: Handlebars.compile($('#photoAlignViewTemplate').html()),
    step: 1,
    masterGroup: null,

    events: {
        'click #doneBtn': '_doneClicked'
    },

    initialize: function(options) {
        _.bindAll(this, 'render', '_doneClicked', '_getUploadGroups');
        this.setCollection = options.setCollection;

        this.collection.bind('reset', this.render);
        this.collection.bind('change', this.render);
        this.collection.bind('add', this.render);
        this.collection.bind('remove', this.render);
        this.setCollection.bind('reset', this.render);

        this.bind('stepchange', this.render);
    },

    render: function() {
        console.log('align render step', this.step);
        var self = this;

        var uploadGroupModels = this._getUploadGroups();
        var uploadGroups = [];
        for (var key in uploadGroupModels) {
            var models = new App.collections.PhotoStore();
            models.reset(uploadGroupModels[key]);
            var json = models.toJSON();
            uploadGroups.push({
                name: key,
                photos: json
            });
        }

        this.$el.html(this.template({
            uploadGroups: uploadGroups
        }));

        if (this.step == 1) {
            this.$el.addClass('step1');

            this.$el.find('.upload-group').click(function() {
                var $this = $(this);
                var name = $this.attr('data-name');
                self.masterGroup = _.find(uploadGroups, function(group) {
                    return group.name == name;
                });
                console.log(self.masterGroup);

                self.$el.removeClass('step1');
                self.step++;
                self.trigger('stepchange');
            });
        }

        return this;
    },

    _doneClicked: function() {
        var set = this.setCollection.toJSON()[0];

        if (set) {
            App.router.navigate('/set/' + set.id + '/photos', {trigger: true});
        }
        else {
            console.log('We dont have a set...');
        }
    },

    _getUploadGroups: function() {
        return this.collection.groupBy(function(photo) {
            return photo.get('upload_group');
        });
    }
});

