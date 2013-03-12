App.views = App.views || {};

App.views.PhotoAlignView = Backbone.View.extend({
    template: Handlebars.compile($('#photoAlignViewTemplate').html()),
    step: 1,
    masterGroupName: null,
    masterGroupPhotos: null,
    groupDivs: [],
    currentlySelectedMaster: null,
    currentlySelectedOther: null,
    shownAlready: false,

    events: {
        'click #doneBtn': '_doneClicked'
    },

    initialize: function(options) {
        _.bindAll(this, 'render', 'reset', '_doneClicked', '_getUploadGroups', '_showNextComparison', '_checkIfFormShouldShow', '_showTimingForm');
        this.setCollection = options.setCollection;

        this.collection.bind('reset', this.render);
        this.collection.bind('change', this.render);
        this.collection.bind('add', this.render);
        this.collection.bind('remove', this.render);
        this.setCollection.bind('reset', this.render);

        this.bind('stepchange', this.render);
    },

    reset: function() {
        this.step = 1;
        this.masterGroupName = null;
        this.masterGroupPhotos = null;
        this.groupDivs = [];
        this.currentlySelectedMaster = null;
        this.currentlySelectedOther = null;
        this.shownAlready = false;
    },

    render: function() {
        console.log('align render step', this.step);
        var self = this;

        this.$el.removeClass('step1');
        this.$el.removeClass('step2');

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
        var self = this;

        var $group = this.groupDivs.shift();
        $group.appendTo('.upload-groups');

        this.$el.find('.upload-group[data-name="' + this.masterGroupName + '"]').find('.group-photo').click(function() {
            var $this = $(this);

            if (self.currentlySelectedMaster) {
                self.currentlySelectedMaster.removeClass('selected');
            }

            $this.addClass('selected');
            self.currentlySelectedMaster = $this;

            self._checkIfFormShouldShow();
        });

        $group.find('.group-photo').click(function() {
            var $this = $(this);

            if (self.currentlySelectedOther) {
                self.currentlySelectedOther.removeClass('selected');
            }

            $this.addClass('selected');
            self.currentlySelectedOther = $this;

            self._checkIfFormShouldShow();
        });
    },

    _checkIfFormShouldShow: function() {
        if (this.currentlySelectedMaster && this.currentlySelectedOther && !this.shownAlready) {
            this.shownAlready = true;
            this._showTimingForm();
        }
    },

    _showTimingForm: function() {
        var $form = $('<div class="changes-form"></div>');

        $form.append('<h4>What is the difference in time between when the first and second photo was taken?</h4>');
        $form.append('Second photo was taken');

        var $days = $('<input class="small-number" type="number" id="days">');
        $days.val('0');
        $form.append($days);
        $form.append('days');

        var $hours = $('<input class="small-number" type="number" id="hours">');
        $hours.val('0');
        $form.append($hours);
        $form.append('hours');

        var $minutes = $('<input class="small-number" type="number" id="minutes">');
        $minutes.val('0');
        $form.append($minutes);
        $form.append('minutes and');

        var $seconds = $('<input class="small-number" type="number" id="seconds">');
        $seconds.val('0');
        $form.append($seconds);
        $form.append('seconds');

        var $beforeAfter = $('<select class="small-select" id="beforeAfter"><option value="before">Before</option><option value="after">After</value></option>');
        $form.append($beforeAfter);

        $form.append('the first');

        var $okButton = $('<button class="btn">Done</button>');
        $form.append($okButton);

        $form.insertAfter('.upload-groups');

        $okButton.click(function() {
            self._makeOffsetChanges();
        });
    },

    _makeOffsetChanges: function() {
        // self.collection.forEach(function(photo) {
        //     if (photo !== model) {
        //         var currentDateTaken = photo.get('date_taken');
        //         var currentDateTakenTimestamp = Date.parseExact(currentDateTaken, 'HH:mm:ss dd-MM-yyyy');
        //         currentDateTakenTimestamp.addSeconds(diff);
        //         photo.set('date_taken', currentDateTakenTimestamp.toString('HH:mm:ss dd-MM-yyyy'));
        //     }
        // });
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

