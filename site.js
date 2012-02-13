---
---
{% include js/jquery.min.js %}
{% include js/underscore-min.js %}
{% include js/backbone-min.js %}
{% include js/bootstrap.min.js %}

$(function() { 

    // TODO: build into a view
    $('.watch').popover({
        placement: 'bottom',
        content: $('.watch-docs').html()
    });

    var App = { models: {}, views: {}};

    var syncJSONP = function (method, model, options) {
        options.timeout = 10000; // required, or the application won't pick up on 404 responses
        options.dataType = "jsonp";
        return Backbone.sync(method, model, options);
    };

    App.models.Watchers = Backbone.Collection.extend({
        url: 'https://api.github.com/'
        + 'repos/{{site.github_login}}/{{site.github_repo}}/watchers',
        sync: syncJSONP,
        parse: function(resp) {
            if (resp.data && resp.data.length) {
                return resp.data;
            }
            else {
                return [];
            }
        }
    });

    App.views.Watchers = Backbone.View.extend({
        el: $('.followers'),
        template: _.template($('#watcherTpl').text()),
        initialize: function(options) {
            _.bindAll(this, 'render');
            this.el = $(this.id);
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

    new App.views.Watchers({
        collection: new App.models.Watchers()
    });
});

