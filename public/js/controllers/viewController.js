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
        currentView = 'home';
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
        views[currentView].el.removeClass('selected');
        views[view].el.addClass('selected');

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
