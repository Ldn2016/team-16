<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Image;


class ImageController extends Controller
{

	public function index() 
	{

		// get all image paths from img directory then push into array
		$dirname = "img/test/";
		$images = glob($dirname."*.jpg");
		$output = [];
		foreach ($images as $img) {
			$object = [
				'image_path' => $img,
				'image_caption' => 'first image'
			];

			array_push($output, $object);
		}

		// post to node server
		$url = 'http://localhost:8088/generate_video';
		$options = array(
			'http' => array(
				'header' => "Content-type: application/x-www-form-urlencoded\r\n",
				'method'  => 'POST',
				'content' => json_encode($output)
				)
			);

		$context = $context_create_stream($context);
		$fp = fopen($url, false,$context);



	}
}
