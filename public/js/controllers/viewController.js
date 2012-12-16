App.viewController = (function() {
    var

    dimensions = {},
    views = {},
    currentView,
    wrapper,
    header,
    content,

    init = function() {
        views = {
            home: {
                el: $('#homeView')
            },
            newSet: {
                el: $('#newSetView')
            },
            photoList: {
                el: $('#photoListView')
            }
        };
        wrapper = $('#wrapper');
        header = $('header');
        content = $('#content');
        currentView = null;
        dimensions = {
            width: views.home.el.width(),
            height: views.home.el.height()
        };

        _addEventHandlersAndTransitions();
        _handleResize();
    },

    showHomeView = function() {
        _showView('home');
    },
    showNewSetView = function() {
        _showView('newSet');
    },
    showPhotoListView = function() {
        _showView('photoList');
    },

    _showView = function(view) {
        if (currentView) {
            views[currentView].el.fadeOut('fast', function() {
                $(this).removeClass('selected');
            });
        }
        views[view].el.fadeIn('fast', function() {
            $(this).addClass('selected');
        });

        currentView = view;
    },

    _addEventHandlersAndTransitions = function() {
        $(window).bind('resize', _handleResize);
    },

    _handleResize = function() {
        content.css({
            height: document.documentElement.clientHeight
        });
    };

    return {
        init: init,
        views: views,
        showHomeView: showHomeView,
        showNewSetView: showNewSetView,
        showPhotoListView: showPhotoListView
    };

}());
