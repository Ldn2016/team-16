<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Facebook\Facebook;

use Socialite;

use Auth;

use Image;

class FbController extends Controller
{
	public function postVideoToFacebook () 
	{

		$fb = FbController::getFbInstance();
/*		<webroot>/output/output_video.mp4
*/		$data = [
		  'title' => "Let's talk about it",
		  'description' => 'A short clip about Alzheimers',
		  'source' => $fb->videoToUpload('D:\Programs\xampp\htdocs\team-16\webserver\jpmorgan\public\vid\vid1.mp4'),
		];
		$data_id = $fb->get('me?fields=id');
		$user_id = json_decode($data_id->getbody())->id;
/*		echo '<pre>';
		var_dump($user_id);
		echo '</pre>';

		die();*/
		try{
			$response = $fb->post('graph-video.facebook.com/' . $user_id .'/videos', $data, Auth::user()->access_token);
			var_dump($response);
		}catch(Facebook\Exceptions\FacebookResponseException $e) {
		  // When Graph returns an error
		  echo 'Graph returned an error: ' . $e->getMessage();
		  exit;
		}
		$graphNode = $response->getGraphNode();
		var_dump($graphNode);
		
		echo 'Video ID: ' . $graphNode['id'];
	}

    public function findRelationshipId ()
    {
    	// returns relationship id;	
    	$fb = FbController::getFbInstance();


    	$relationships = $fb->get('me?fields=id,relationship_status,significant_other')->getDecodedBody();

    	if ($relationships != 'Single'){
    		$significant_other_id = $relationships['significant_other']['id'];
    		$relevant_photo_ids = FbController::getPhotosWith($significant_other_id, $fb);
    		
    		// show image
    		foreach ($relevant_photo_ids as $id) {

    			//$bin_img = file_get_contents('http://graph.facebook.com/' . $id . '/picture?width=300&height=300');
    			$image = $fb->get($id . '/picture?width=300&height=300');
    			$img = Image::make($image->getheaders()['Location']);
    			$img->save('img/test/' . $id . '.jpg' );
    		}
    	}
    }

    public function getPhotosWith($significant_other_id, $fb_instance)
    {

    	/*	var_dump(count($photos['data'][0]['tags']['data']));*/
    	$response = $fb_instance->get('me/photos?fields=tags{id},id,next');
    	$photos = $response->getDecodedBody();

  		$relevant_photos = [];
  		$count = 0;
/*
  		while($photos['paging']['next'] || $count < 2){*/
  		 	for ($i=0; $i < 24; $i++) { 
  		 		if (count($photos['data'][$i]['tags']['data']) <= 3){
  		/* 			echo '<pre>';
  		 				var_dump($photos);
  		 			echo '</pre>';
  		 			die();*/

  		 			foreach ($photos['data'][$i]['tags']['data'] as $key => $tag) {
  		 				if ($tag['id'] == $significant_other_id){
  		 					array_push($relevant_photos, $photos['data'][$i]['id']);
  		 				}
  		 			}
  		 		}
  		 	}
/*  		 	$count++;
  	
  		} */



  		 /*{ //for every picture you have
  		    if(response.data[i].tags.data.length <= 3){ // check how many ppl taged and limit it
  		      //me, you
  		      for(y in response.data[i].tags.data) { //for every tag
  		        if(response.data[i].tags.data[y].id == you){ //check whether 'you' are tagged
  		          showimg(response.data[i].id); //get the img id
  		        }
  		      }
  		    }
  		  }*/
  		  return $relevant_photos;
    }




    public function getFbInstance()
    {
    	$fb = new Facebook([
    	  'app_id' => '757618434392766',
    	  'app_secret' => '4b9f8a925080a45e87e19ef36444e507',
    	  'default_graph_version' => 'v2.8',
    	  ]);

    	$fb->setDefaultAccessToken(Auth::user()->access_token);

    	return $fb;
    }




}
