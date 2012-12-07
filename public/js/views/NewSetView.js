App.views = App.views || {};

App.views.NewSetView = Backbone.View.extend({
    template: Handlebars.compile($('#newSetViewTemplate').html()),

    events: {
        'submit #newSetForm': 'formSubmit',
        'click .btn#cancel': 'formCancel'
    },

    initialize: function() {
        _.bindAll(this, 'render', 'formSubmit', 'formCancel');
    },

    render: function() {
        this.$el.html(this.template());
        this.$el.find('.date').datepicker();
        return this;
    },

    formSubmit: function() {
        var valid = this._doesFormValidate();

        if (!valid) {
            console.log("Form is not valid");
            return false;
        }

        console.log('Form submit');
        return false;
    },

    formCancel: function() {
        App.router.navigate('', {trigger: true});
    },

    _doesFormValidate: function() {
        // Get the values
        var title = this.$el.find('#inputTitle').val().trim();
        var description = this.$el.find('#inputDescription').val().trim();
        var startDate = this.$el.find('#inputStartDate input').val().trim();
        var endDate = this.$el.find('#inputEndDate input').val().trim();

        // Get references to the groups
        var $titleGroup = this.$el.find('#titleGroup');
        var $descriptionGroup = this.$el.find('#descriptionGroup');
        var $startDateGroup = this.$el.find('#startDateGroup');
        var $endDateGroup = this.$el.find('#endDateGroup');

        // Set the class for the groups to show the user errors
        // Title
        if (title === "") {
            $titleGroup.addClass('error');
        }
        else {
            $titleGroup.removeClass('error');
        }
        // Description
        if (description === "") {
            $descriptionGroup.addClass('error');
        }
        else {
            $descriptionGroup.removeClass('error');
        }
        // Start date
        if (startDate === "") {
            $startDateGroup.addClass('error');
        }
        else {
            $startDateGroup.removeClass('error');
        }
        // End date
        if (endDate === "") {
            $endDateGroup.addClass('error');
        }
        else {
            $endDateGroup.removeClass('error');
        }

        // Return if the form is valid or not
        return (title !== "" && description !== "" && startDate !== "" && endDate !== "");
    }
});

