<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Facebook\Facebook;

use Socialite;

use Auth;

class FbController extends Controller
{

    public function findRelationshipId ()
    {
    	// returns relationship id;	
    	$fb = FbController::getFbInstance();


    	$relationships = $fb->get('me?fields=id,relationship_status,significant_other')->getDecodedBody();

    	if ($relationships != 'Single'){
    		$significant_other_id = $relationships['significant_other']['id'];
    		FbController::getPhotosWith($significant_other_id, $fb);
    		die('end');
    	}
    }

    public function getPhotosWith($significant_other_id, $fb_instance)
    {

    	/*	var_dump(count($photos['data'][0]['tags']['data']));*/
    	$photos = $fb_instance->get('me/photos?fields=tags{id},id,next')->getDecodedBody();
    	echo '<pre>';
  			var_dump($photos);
  		echo '</pre>';
  		$count = 0;
  		while($photos['next'] || $count < 4)
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




  		die();
    }




    public function getFbInstance()
    {
    	$fb = new Facebook([
    	  'app_id' => '202597166866296',
    	  'app_secret' => '94783b6c8ac69fea87898106bb9221d5',
    	  'default_graph_version' => 'v2.8',
    	  ]);

    	$fb->setDefaultAccessToken(Auth::user()->access_token);

    	return $fb;
    }




}
