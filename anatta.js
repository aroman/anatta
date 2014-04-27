if (Meteor.isClient) {


  var checkNotifications = function () {
    FB.api("/me/notifications", function (response) {
          console.log(response);
          if (response && !response.error) {
            window.response = response;
            console.log("Hello!")
            if (!_.isEmpty(response.data)) {
              $("body").css("background-color", "hsl(222.3,36.7%,47.1%)");
            } else {
              $("body").css("background-color", "white");
            }
          } else {
            alert(response.error)
          }
    });
  }

  window.fbAsyncInit = function() {
    FB.init({
      appId      : '1425469807706064',
      status     : true,
      logging    : false,
      xfbml      : true
    });

    FB.getLoginStatus(function(response) {
      console.log(response);
      if (response.status === 'connected') {
        $(".fb-login-button").hide();
        Meteor.setInterval(checkNotifications, 1000);
      } else {
        console.log("Facebook log-in failed :(")
      }
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
