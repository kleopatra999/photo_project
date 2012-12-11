App.models = {};

App.models.Set = Backbone.Model.extend({
    url: '/set'
});

App.models.Photo = Backbone.Model.extend({
    url: function() {
        if (!this.get('setId')) {
            throw "Need to set a setId on the collection before fetching";
        }
        return '/photo?set_id=' + this.get('setId');
    },

    sync: function(method, model, options) {
        var self = this;

        if (method == 'create') {
            var uri = this.url();
            var xhr = new XMLHttpRequest();
            var formData = new FormData();

            xhr.open("POST", uri, true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 201) {
                    self.unset('localFile', {silent: true});
                    self.unset('localFileBlob', {silent: true});
                    self.trigger('change');
                    options.success(JSON.parse(xhr.response), xhr.status, xhr);
                }
                else if (xhr.readyState == 4 && options.error) {
                    options.error();
                }
            };
            formData.append('photo', this.get('localFileBlob'));
            // Initiate a multipart/form-data upload
            xhr.send(formData);
            return xhr;
        }
        else {
            // Use the normal backbone sync
            return Backbone.sync(method, model, options);
        }
    }
});
