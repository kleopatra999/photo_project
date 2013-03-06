App.viewController = (function() {
    var

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
            setList: {
                el: $('#setListView')
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
            register: {
                el: $('#registerView')
            }
        };
        modalViews = {
            changeAllDates: {
                el: $('#changeAllDatesView')
            },
            login: {
                el: $('#loginView')
            }
        };
        wrapper = $('#wrapper');
        header = $('header');
        content = $('#content');
        modal = $('#modal');
        htmlRoot = $('html');
        currentView = null;
        currentModalView = null;
    },

    showSetListView = function() {
        _showView('setList');
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
        _showModalView('login');
    },
    showChangeAllDatesView = function() {
        _showModalView('changeAllDates');
    },
    showRegisterView = function() {
        _showView('register');
    },

    _showView = function(view) {
        _removeModalContent(true);

        if (currentView != view) {
            var showNew = function() {
                views[view].el.fadeIn('fast', function() {
                    $(this).addClass('selected');
                });
            };

            if (currentView) {
                views[currentView].el.fadeOut('fast', function() {
                    $(this).removeClass('selected');
                    showNew();
                });
            }
            else {
                showNew();
            }

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
                currentModalView = null;
            }, 300);

            if (andHide !== null && andHide) {
                htmlRoot.removeClass('show-modal');
            }
        }
    };

    return {
        init: init,
        views: views,
        showSetListView: showSetListView,
        showNewSetView: showNewSetView,
        showPhotoListView: showPhotoListView,
        showPhotoUploadView: showPhotoUploadView,
        showLoginView: showLoginView,
        showRegisterView: showRegisterView,
        showChangeAllDatesView: showChangeAllDatesView
    };

}());
