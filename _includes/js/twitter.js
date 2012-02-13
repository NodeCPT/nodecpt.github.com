/**
* Correctly interpret the plain text tweet text, adding all the links.
*/
function formatTweet(value) {
    var regexp = {
        links: {
            match: /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/gi,
            replace: function(match) {
                var url = (/^[a-z]+:/i).test(match) ? match : 'http://' + match;
                return '<a href="' + url + '">' + match + '</a>';
            }
        },
        usernames:  {
            match: /[\@]+(\w+)/gi,
            replace: '<a href="http://twitter.com/$1">@$1</a>'
        },
        hashes: {
            match: /(?:^| )[\#]+([\w\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u00ff\u0600-\u06ff]+)/gi,
            replace: ' <a href="http://search.twitter.com/search?q=$1&tag=$1&lang=all">#$1</a>',
        }
    };

    _(regexp).each(function(r) {
        value = value.replace(r.match, r.replace);
    });

    return value;
}

// create a new model for tweets
models.Tweets = Backbone.Collection.extend({
    url: 'http://search.twitter.com/search.json',
    sync: function (method, model, options) {
        options.timeout = 10000;
        options.dataType = "jsonp";
        console.log(arguments);
        if (method === 'read') {
            options.data = { q: '{{site.twitter_search}}', rpp:100 };
        }
        return Backbone.sync(method, model, options);
    },
    // link the usernames to a local fragment
    parse: function(response) {
        return _(response.results).map(function(data) {
            data.text = formatTweet(data.text);
            return data;
        });      
    }
});

views.Tweets = Backbone.View.extend({
    el: $('.tweets'),
    template: _.template($('#tweetTpl').text()),
    initialize: function(options) {
        _.bindAll(this, 'render');
        this.collection.on('reset', this.render);
        this.collection.fetch();
    },
    render: function(options) {
        var self = this;
        this.collection.chain().first(8).each(function (m) {
            self.$el.append(self.template({model: m}));
        });
        $('.tweet').popover({placement: 'top'});

        return this;
    }
});
