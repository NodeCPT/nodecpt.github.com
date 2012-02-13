/**
* Sync method that uses jsonp as transport.
*/
var syncJSONP = function (method, model, options) {
    options.timeout = 10000;
    options.dataType = "jsonp";
    return Backbone.sync(method, model, options);
};

/**
 * Fetch watchers of nodecpt project.
 */
models.Watchers = Backbone.Collection.extend({
    url: 'https://api.github.com/'
        + 'repos/{{site.github_login}}/{{site.github_repo}}/watchers',
    sync: syncJSONP,
    parse: function(resp) {
        return (resp.data && resp.data.length) ? resp.data : [];
    }
});

/**
 * Display watchers.
 */
views.Watchers = Backbone.View.extend({
    el: $('.followers'),
    template: _.template($('#watcherTpl').text()),
    initialize: function(options) {
        _.bindAll(this, 'render');
        this.collection.on('reset', this.render);
        this.collection.fetch();
    },
    render: function() {
        var self = this;
        this.collection.each(function (m) {
            self.$el.append(self.template({model: m}));
        });
        $('.github-user').popover({placement: 'left'});
        return this;
    }
});
