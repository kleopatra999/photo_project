App.views = App.views || {};

App.views.PhotoAlignView = Backbone.View.extend({
    template: Handlebars.compile($('#photoAlignViewTemplate').html()),
    step: 1,
    masterGroupName: null,
    masterGroupPhotos: null,
    otherGroupName: null,
    otherGroupPhotos: null,
    groupDivs: [],
    currentlySelectedMaster: null,
    currentlySelectedOther: null,
    shownAlready: false,
    uploadGroupModels: null,

    events: {
        'click #doneBtn': '_doneClicked'
    },

    initialize: function(options) {
        _.bindAll(this, 'render', 'reset', '_doneClicked', '_getUploadGroups', '_showNextComparison', '_checkIfFormShouldShow', '_showTimingForm', '_makeOffsetChanges');
        this.setCollection = options.setCollection;

        this.collection.bind('reset', this.render);
        this.setCollection.bind('reset', this.render);

        this.bind('stepchange', this.render);
    },

    reset: function() {
        this.step = 1;
        this.masterGroupName = null;
        this.masterGroupPhotos = null;
        this.otherGroupName = null;
        this.otherGroupPhotos =  null;
        this.groupDivs = [];
        this.currentlySelectedMaster = null;
        this.currentlySelectedOther = null;
        this.shownAlready = false;
        this.uploadGroupModels = null;
    },

    render: function() {
        console.log('align render step', this.step);
        var self = this;

        this.$el.removeClass('step1');
        this.$el.removeClass('step2');

        this.uploadGroupModels = this._getUploadGroups();
        var uploadGroups = [];
        for (var key in this.uploadGroupModels) {
            var models = new App.collections.PhotoStore();
            models.reset(this.uploadGroupModels[key]);
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
                self.masterGroupPhotos = _.find(self.uploadGroupModels, function(group, key) {
                    return key == self.masterGroupName;
                });

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

        this.otherGroupName = $group.attr('data-name');
        this.otherGroupPhotos = _.find(this.uploadGroupModels, function(group, key) {
            return key == self.otherGroupName;
        });

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
        var self = this;

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
            var days = $days.val();
            var hours = $hours.val();
            var minutes = $minutes.val();
            var seconds = $seconds.val();
            var beforeAfter = $beforeAfter.val();
            self._makeOffsetChanges(days, hours, minutes, seconds, (beforeAfter == 'before'));
        });
    },

    _makeOffsetChanges: function(days, hours, minutes, seconds, before) {
        // Hide the form
        this.$el.find('.changes-form').remove();
        this.$el.find('.group-photo').unbind('click');

        // Get the master photo
        var masterId = this.currentlySelectedMaster.attr('data-id');
        var masterPhotos = new App.collections.PhotoStore();
        masterPhotos.reset(this.masterGroupPhotos);
        var masterPhoto = masterPhotos.get(masterId);
        // Get the other photo
        var otherId = this.currentlySelectedOther.attr('data-id');
        var otherPhotos = new App.collections.PhotoStore();
        otherPhotos.reset(this.otherGroupPhotos);
        var otherPhoto = otherPhotos.get(otherId);

        // Get the current times
        console.log(days, hours, minutes, seconds, before);
        var masterTime = moment(masterPhoto.get('date_taken'), 'HH:mm:ss DD-MM-YYYY');
        console.log(masterTime.format());
        var otherTime = moment(otherPhoto.get('date_taken'), 'HH:mm:ss DD-MM-YYYY');
        console.log(otherTime.format());
        // Work out the target time for the other time
        var targetTime = masterTime.clone();
        console.log(targetTime.format());
        if (before) {
            targetTime.subtract({
                'days': days,
                'hours': hours,
                'minutes': minutes,
                'seconds': seconds
            });
        }
        else {
            targetTime.add({
                'days': days,
                'hours': hours,
                'minutes': minutes,
                'seconds': seconds
            });
        }
        console.log(targetTime.format());
        // Work out the change between the other time and the target
        var change = otherTime.diff(targetTime);
        console.log(change);
        // Go through all photos and change the time by the change
        otherPhotos.forEach(function(photo) {
            var currentTime = moment(photo.get('date_taken'), 'HH:mm:ss DD-MM-YYYY');
            var newOtherTime = currentTime.clone();
            newOtherTime.subtract('milliseconds', change);
            photo.save({
                'date_taken': newOtherTime.format('HH:mm:ss DD-MM-YYYY')
            });
        });

        console.log('Done all changes');

        // Reset the state
        this.currentlySelectedMaster = null;
        this.currentlySelectedOther = null;
        this.shownAlready = false;

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

