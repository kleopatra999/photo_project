App.viewController = (function() {
    var

    dimensions = {},
    views = {},
    modalViews = {},
    currentView,
    wrapper,
    header,
    content,
    modal,
    htmlRoot,

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
            },
            photoUpload: {
                el: $('#photoUploadView')
            },
            login: {
                el: $('#loginView')
            }
        };
        modalViews = {
            changeAllDates: {
                el: $('#changeAllDatesView')
            }
        };
        wrapper = $('#wrapper');
        header = $('header');
        content = $('#content');
        modal = $('#modal');
        htmlRoot = $('html');
        currentView = null;
        currentModalView = null;
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
    showPhotoUploadView = function() {
        _showView('photoUpload');
    },
    showLoginView = function() {
        _showView('login');
    },
    showChangeAllDatesView = function() {
        _showModalView('changeAllDates');
    },

    _showView = function(view) {
        _removeModalContent(true);

        if (currentView != view) {
            if (currentView) {
                views[currentView].el.fadeOut('fast', function() {
                    $(this).removeClass('selected');
                });
            }

            views[view].el.fadeIn('fast', function() {
                $(this).addClass('selected');
            });

            currentView = view;
        }
    },

    _showModalView = function(view) {
        _removeModalContent();

        htmlRoot.addClass('show-modal');

        currentModalView = view;
    },

    _removeModalContent = function(andHide) {
        if (currentModalView) {
            setTimeout(function() {
                modalViews[currentModalView].el.html(''); // Remove the content
            }, 300);
            currentModalView = null;

            if (andHide !== null && andHide) {
                htmlRoot.removeClass('show-modal');
            }
        }
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
        showPhotoListView: showPhotoListView,
        showPhotoUploadView: showPhotoUploadView,
        showLoginView: showLoginView,
        showChangeAllDatesView: showChangeAllDatesView
    };

}());
