
// This file contains a number of useful functions



// We fire this function when a user's login status has changed
function handleStatusChange(response) {
//This for response and pass it to the other functions
    if (response.authResponse) {
        updateUserInfo(response);
        getCommonLikes(response);
    }
}

function updateUserInfo(response) {
// Call the Graph API to request the likes, id & name of of the logged in user
    FB.api('/me&fields=id,name', function(response) {

        var userDetails = '';
        var actionBtns = '';

        userDetails += '<img src="https://graph.facebook.com/' +response.id + '/picture" class="center_this">'; // Render the profile pic of the user
        userDetails += '<p class="center_this">' + response.name + '</p>'; // render the user's name

        actionBtns += '<div class="ui-block-a"><a href="#" data-role="button" id="stream" data-theme="b">Publish</a></div>'; //Button to fire a publish action
        actionBtns += '<div class="ui-block-b"><a href="#" data-role="button" id="request" data-theme="b">Request</a></div>'; //Button to render a request

        $("#user-info").html(userDetails); // Populate the #user-info element with the User's picture and name
        $("#action_btns").html(actionBtns).trigger('create'); // Populate the #action_btns element with our action buttons

        // When the action buttons are tapped, fire the relevant function
        $("#stream").tap(
            function() {
                publishStory();
            }
        );

        $("#request").tap(
            function() {
                sendRequest();
            }
        );
    });
}

function publishStory() {
    //Create a FB Feed Dialog & capture the response
    FB.ui({
        method: 'feed',
        name: 'I\'m building a social mobile web app!',
        caption: 'This web app is going to be awesome.',
        description: 'Check out Facebook\'s developer site to start building.',
        link: 'http://icebreaker.fbdublin.com/index.html',
        picture: 'http://www.colmisainmdom.com/img/headshot.jpg'
    },
    function(response) {
        console.log('publishStory response: ', response);
    });
    return false;
}

function sendRequest() {
    //Create a FB Requests Dialog for the user and capture the response
    FB.ui({
        method: 'apprequests',
        message: 'Check out this awesome app!'
    },
    function(response) {
        console.log('sendRequest response: ', response);
    });
}

function displayLoginButton() {
    $("#user-info").html('<a href="#" id="login" data-role="button" data-theme="b">Login</a>');
}

function getCommonLikes(response) {
    var output = '';

    navigator.geolocation.getCurrentPosition(function(location) {

        //Use Ajax to send location to the API script, then capture the response
        $.ajax({url: 'api.php', type: "POST", dataType: 'json', data: { method: "getCommonLikes", location: location.coords }, success: function(data) {

            output = '';

            //Uncoment the following line for debugging
            //console.log(data);

            output += '<ul data-role="listview" data-theme="b" data-inset="true">';

            if (data == null) {
                console.log('no likes');
                output += '<p> No Common Likes </p>';
            }


            // Cycle through the common likes and render them
            for (var i = 0; i < data.likes.length; i++) {
                output += '<li data-role="list-divider" >';
                output += '<h3>' + data.likes[i].like_name + '<span class="ui-li-count">' + data.likes[i].uids.length + '</span></h3>'; // The common like and the number of people in common
                output += '</li>';


                if (data.likes[i].uids) {
                    for (var n = 0; n < data.likes[i].uids.length; n++) {
                        output += '<li>';
                        output += '<img src="http://graph.facebook.com/' + data.likes[i].uids[n].id + '/picture?type=square" alt="' + data.likes[i].uids[n].name + '"> <h3>' + data.likes[i].uids[n].name + '</h3>'; //Render the name and pic of people who like it
                        output += '</li>';
                    }
                }
            }

            output += '</ul>';

            $('.like-holder').html(output).trigger('create'); //Background refresh the list so it renders correctly

            //console.log(output);
        }});
    },
    function(error) {
        alert('You need to allow location, first.  Please refresh.');
    });
}
