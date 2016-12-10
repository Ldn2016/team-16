window.fbAsyncInit = function() {
  FB.init({
    appId      : '202597166866296',
    xfbml      : true,
    version    : 'v2.8'
  });
  FB.AppEvents.logPageView();
};

(function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "//connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));


function getMeYou() { //get my id and 'you'(significant_other or in later cases whoever 'you' is)
    var me;
    var you;
    FB.getLoginStatus(function(response) {
    
    if (response.status === 'connected') {
      FB.api('me?fields=id,relationship_status,significant_other', function(response) { // gets relationship status and sig other
        if(response.relationship_status != "Single") {
          console.log(response.significant_other);
          you = response.significant_other.id;
          me = response.id;
          getPhotosWith(me, you);
        }
        else {
          //add code for family then friends etc
        }
      });
    }
    else {
      logUserIn();
    }
  });
}

// function to get photos that contain only you and me
//since its quite rare to have pictures of only me and you maybe delete the tag limit
//note that this will only search the first 25 - can easily extend by using the next page token and running the function again
//maybe add a new variable for the next page token
//also... this might not get photos that you uploaded yourself but did not tag yourself 
//run api call 'me/photos?type=uploaded' for photos you uploaded but... need to check for duplicates
function getPhotosWith(me, you) { 
  console.log(me);
  FB.getLoginStatus(function(response) {
  if (response.status === 'connected') {
    FB.api('me/photos?fields=tags{id},id,next', function(response) {
      console.log(response);
      count = 0;
      while(response.data[24] || count <= 10){
        for(i in response.data) { //for every picture you have
          if(response.data[i].tags.data.length <= 3){ // check how many ppl taged and limit it
            //me, you
            for(y in response.data[i].tags.data) { //for every tag
              if(response.data[i].tags.data[y].id == you){ //check whether 'you' are tagged
                showimg(response.data[i].id); //get the img id
              }
            }
          }
        }
      count++;
      }
      
    });
  }
  else {
    logUserIn();
  }
  });
}

function logUserIn() {
  FB.login(function(response) {
    // handle the response
  }, {scope: 'user_photos,user_relationships,user_relationship_details'});
}

function showimg(imgID) { //debug just show the img
  FB.api(imgID + '/picture?width=500&height=500', function(response) { //this is the api call to get picture of a certain size
    parent = document.getElementById('imgs');
    child = document.createElement('img');
    child.src = response.data.url;
    parent.appendChild(child);
    console.log(response);
  });
}


