---
---
{% include js/jquery.min.js %}
{% include js/underscore-min.js %}
{% include js/backbone-min.js %}
{% include js/bootstrap.min.js %}

// Container
var models = {},
    views = {};

{% include js/github.js %}
{% include js/twitter.js %}


$(function() { 

    // TODO: build into a view
    $('.watch').popover({
        placement: 'bottom',
        content: $('.watch-docs').html()
    });

    new views.Watchers({
        collection: new models.Watchers()
    });
    new views.Tweets({
        collection: new models.Tweets()
    });
});

