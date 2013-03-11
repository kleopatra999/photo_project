App.views = App.views || {};

App.views.PhotoAlignView = Backbone.View.extend({
    template: Handlebars.compile($('#photoAlignViewTemplate').html()),
    step: 1,
    masterGroupName: null,
    masterGroupPhotos: null,
    groupDivs: [],

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
                self.masterGroupName = $this.attr('data-name');
                self.masterGroupPhotos = _.find(uploadGroupModels, function(group, key) {
                    return key == self.masterGroupName;
                });
                console.log(self.masterGroupName);

                self.$el.removeClass('step1');
                self.step++;
                self.trigger('stepchange');
            });
        }
        else if (this.step == 2) {
            this.$el.addClass('step2');

            // Move the master group to the top
            this.$el.find('.upload-group[data-name="' + this.masterGroupName + '"]').detach().prependTo('.upload-groups');

            this.groupDivs = [];
            this.$el.find('.upload-group[data-name!="' + this.masterGroupName + '"]').each(function() {
                var $this = $(this);
                $this.detach();
                self.groupDivs.push($this);
            });

            this._showNextComparison();
        }

        return this;
    },

    _showNextComparison: function() {

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

