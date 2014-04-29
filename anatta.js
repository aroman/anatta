if (Meteor.isClient) {

  var pollTimer = null;

  var checkNotifications = function () {
    console.log("checkNotifications()");
    FB.api("/me/notifications", function (response) {
      console.log(response);
      if (response && !response.error) {
        window.response = response;
        console.log("Hello!")
        if (!_.isEmpty(response.data)) {
          $("body").css("background-color", "hsl(222.3,36.7%,47.1%)");
          $("#clock").css("color", "white");
        } else {
          $("body").css("background-color", "white");
          $("#clock").css("color", "black");
        }
      }
    });
  }

  var onConnection = function () {
    pollTimer = Meteor.setInterval(checkNotifications, 2000);
    $("#mat").fadeOut('slow', function () {
      $("#clock").fadeIn();
    });
    checkNotifications();
  };

  var authStatusChanged = function (response) {
    console.log('in auth.statusChange')
    console.log(response);
    if (response.status === "connected") { // Logged in
      onConnection();
    }
    else if (response.status === "unknown") { // Logged out
      Meteor.clearInterval(pollTimer);
    } else { // No idea
      alert("wtf, response.status = " + response.status);
    }
  };

  window.fbAsyncInit = function() {
    FB.init({
      appId      : '1425469807706064',
      status     : true,
      logging    : false,
      xfbml      : true
    });

    FB.getLoginStatus(function(response) {
      console.log(response);
      if (response.status === "connected") {
        onConnection();
      }
      FB.Event.subscribe('auth.statusChange', authStatusChanged);
    });

  };

  Meteor.setInterval(function () {
    Session.set("moment", moment().toDate()); 
  }, 1000);

  Template.clock.time = function () {
    return moment(Session.get('moment')).format('h:mm a');
  };

  Template.clock.date = function () {
    return moment(Session.get('moment')).format('dddd D');
  };
  
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
