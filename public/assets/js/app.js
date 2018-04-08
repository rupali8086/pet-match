var msgBoxFunction = null;
var editingProfile = false;

function displayError(title, message) {
    $('#modal-error-message').text(title);
    $('#modal-error-details').text(message || '');
    displayModal('.modal-content-error');
}

function displayMsgbox(title, message, showCancelButton) {
    msgBoxFunction = null;
    $('#modal-message-message').text(title);
    $('#modal-message-details').text(message || '');
    $('#message-cancel').css({ display: showCancelButton ? 'inline-block' : 'none' });
    displayModal('.modal-content-message');
}

function displayModal(modalSelector) {
    var $modal = $('.modal');
    $modal.children().each(function () {
        $(this).hide();
    })

    $(modalSelector).show();
    $modal.show();

    $(document.body).addClass('fixed');
}

function hideModal() {
    $('.modal').hide();
    $(document.body).removeClass('fixed');
}


$(document).ready(function () {
    $('#event-input-submit').on('click', function (e) {
        e.preventDefault();

        var eventData = {
            name: $('#event-input-name').val(),
            date: $('#event-input-datetime').val(),
            address1: $('#event-input-address1').val(),
            address2: $('#event-input-address2').val(),
            city: $('#event-input-city').val(),
            state: $('#event-input-state').val(),
            zip: $('#event-input-zip').val(),
            description: $('#event-input-description').val(),
            link: $('#event-input-link').val(),
        }

        $.ajax({
            url: "/api/editInfo",
            method: "POST",
            data: eventData
        }).then(function (response) {
            // alert(response.status);
            if (response.status == 'inserted') {
                window.location.href = '/eventDetails?id=' + response.value.id;
            } else {
                // alert("Error. Do something here.");
                displayError('Error submitting event', response.error.message || response.error.msg || response.error || 'unknown error');
            }
        });
    });

    $('#profile-edit-button').on('click', function (e) {
        if (editingProfile) {
            var newData = {
                firstName: $('#profile-firstName').val(),
                lastName: $('#profile-lastName').val(),
                displayName: $('#profile-displayName').val(),
                bio: $('#profile-bio').val(),
                email: $('#profile-email').val(),
            };

            $.ajax({
                url: '/api/profile/', // + $('#hidden-id').val(),
                method: 'PUT',
                data: newData
            }).then(function (result) {
                if (result.status == 'updated') {
                    window.location.reload();
                } else {
                    displayError('Profile Error', "Could not update the profile");
                }
                
            });
        } else {
            $('.profile-value').each(function (index) {
                var $element = $(this);

                var edit;
                if ($element.hasClass('profile-value-long')) {
                    edit = $('<textarea>');
                } else {
                    edit = $('<input>');
                }                    
                    
                edit.attr('id', $element.attr('id'));
                edit.val($element.text());
                edit.addClass('profile-input');

                $element.replaceWith(edit);
            });

            editingProfile = true;
            $('#profile-edit-button').text('Save Changes');
        }
    });

    $('.event-edit-ok').on('click', function (e) {
        e.preventDefault();

        var eventData = {
            name: $('#event-input-title').val(),
            date: $('#event-input-date').val(),
            address1: $('#event-input-address-1').val(),
            address2: $('#event-input-address-2').val(),
            city: $('#event-input-city').val(),
            state: $('#event-input-state').val(),
            zip: $('#event-input-zip').val(),
            description: $('#event-input-description').val(),
            link: $('#event-input-link').val(),
        }

        $.ajax({
            url: "/api/editInfo/" + $('#event-input-id').val(),
            method: "PUT",
            data: eventData
        }).then(function (response) {
            // alert(response.status);
            if (response.status == 'updated') {
                window.location.reload();
            } else {
                displayError('Error submitting event', response.error.message || response.error.msg || response.error || 'unknown error');
            }
        });
    });

    $('.event-input').css({ display: 'none' });
    $('.event-edit-cancel').css({ display: 'none' });
    $('.event-edit-ok').css({ display: 'none' });

    $('.event-edit-delete').on('click', function (e) {
        displayMsgbox("Deleting Event", "The event listing will be permanently deleted.", true);
        msgBoxFunction = 'delete';
    });

    $('.event-edit-btn').on('click', function (e) {
        $('.event-input').css({ display: 'initial' });
        $('.event-text').css({ display: 'none' });

        $('.event-edit-btn').css({ display: 'none' });
        $('.event-edit-delete').css({ display: 'none' });
        $('.event-edit-cancel').css({ display: 'initial' });
        $('.event-edit-ok').css({ display: 'initial' });
    });
    $('.event-edit-cancel').on('click', function (e) {
        $('.event-input').css({ display: 'none' });
        $('.event-text').css({ display: 'block' });

        $('.event-edit-btn').css({ display: 'initial' });
        $('.event-edit-delete').css({ display: 'initial' });
        $('.event-edit-cancel').css({ display: 'none' });
        $('.event-edit-ok').css({ display: 'none' });
    });

    $('#error-ok').on('click', function () { hideModal(); })
    $('#message-cancel').on('click', function () { hideModal(); })
    $('#message-ok').on('click', function () {
        hideModal();
        if (msgBoxFunction == 'delete') {
            $.ajax({
                url: "/api/editInfo/" + $('#event-input-id').val(),
                method: "DELETE",
            }).then(function (response) {
                // alert(response.status);
                if (response.status == 'removed') {
                    window.location.href = '/events';
                } else {
                    var err = response.error || {};
                    displayError('Error submitting event',
                        err.message || err.msg || err || 'The listing could not be removed.');
                }
            });
        }
    })
    $('.modal').on('click', function () { hideModal(); })
});



/* handlebars should render an object in the form of:
    var pmClientData = {
        registerData?: {
            
        }      
    }
*/

/** @constructor */
function PmClient() {
    var registerPage = $('#new-user-submit').length != 0;

    if (registerPage) {
        initRegisterPage();
    }
} { // Methods
    PmClient.prototype.initRegisterPage = function () {

    }
}
