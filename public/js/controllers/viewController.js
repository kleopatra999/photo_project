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
                position: 1,
                el: $('#homeView')
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
        
    _showView = function(view) {
        if (views[currentView].position < views[view].position) {
            views[currentView].el.addClass('left').removeClass('selected');
            views[view].el.removeClass('left right').addClass('selected');
        } else {
            views[currentView].el.addClass('right').removeClass('selected');
            views[view].el.removeClass('left right').addClass('selected');
        }
        wrapper.removeClass(currentView).addClass(view);

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
        showHomeView: showHomeView
    };

}());
