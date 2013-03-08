App.views = App.views || {};

App.views.ShareView = Backbone.View.extend({
    setId: -1,
    template: Handlebars.compile($('#shareViewTemplate').html()),

    events: {
        'click .shareSubmit': '_shareClicked',
        'click .shareCancel': '_cancelClicked'
    },

    initialize: function() {
        _.bindAll(this, 'render', '_shareClicked', '_shareComplete', '_shareFailed', '_cancelClicked');
    },

    render: function() {
        this.$el.html(this.template());
        return this;
    },

    _shareClicked: function() {
        // Get the user details
        var email = this.$el.find('input#email').val();

        // Register for callbacks from the data controller
        App.dataController.bind(App.dataController.SET_SHARED, this._shareComplete);
        App.dataController.bind(App.dataController.SET_SHARE_FAILED, this._shareFailed);

        // Make the request
        App.dataController.shareSet(this.setId, email);

        // Return false to keep us on the same page
        return false;
    },
    _shareComplete: function() {
        App.dataController.unbind(App.dataController.SET_SHARED);
        App.dataController.unbind(App.dataController.SET_SHARE_FAILED);

        var set = App.photoListView.setCollection.toJSON()[0];
        console.log(set);
        if (set) {
            App.router.navigate('/set/' + set.id + '/photos', {trigger: true});
        }
        else {
            console.log('We dont have a set...');
        }
        return false;
    },
    _shareFailed: function() {
        App.dataController.unbind(App.dataController.SET_SHARED);
        App.dataController.unbind(App.dataController.SET_SHARE_FAILED);

        console.log('Share Failed');
        return false;
    },

    _cancelClicked: function() {
        var set = App.photoListView.setCollection.toJSON()[0];
        console.log(set);
        if (set) {
            App.router.navigate('/set/' + set.id + '/photos', {trigger: true});
        }
        else {
            console.log('We dont have a set...');
        }
        return false;
    }
});

