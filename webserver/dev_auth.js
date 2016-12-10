
window.fbAsyncInit = function() {
    FB.init({
      appId      : '202597166866296',
      xfbml      : true,
      version    : 'v2.8'
    });

    /**
      * Get 
      */

    FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
        console.log(response.authResponse.accessToken);
      }
      else 
      {
        FB.login(function(response) {
          console.log(response.authResponse.accessToken);
        });
      }
    });
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));


 



