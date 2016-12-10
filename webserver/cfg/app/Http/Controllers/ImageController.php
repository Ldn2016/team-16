<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Image;


class ImageController extends Controller
{

/*	[
	    {
	        'image_path': 'C:\path\to\image_1.jpg',
	        'image_caption': 'Caption #1'
	    },
	    {
	        'image_path': 'C:\path\to\image_2.jpg',
	        'image_caption': 'Caption #2'
	    },
	    {
	        'image_path': 'C:\path\to\image_3.jpg',
	        'image_caption': 'Caption #3'
	    }
	]*/

	public function index() 
	{
		$output = [];
		$images = ['img/test/br1.jpg', 'img/test/br1.jpg'];
		foreach ($images as $img) {
			$object = [
				'image_path' => $img,
				'image_caption' => 'first image'
			];

			array_push($output, $object);
		}

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
	public function sendLink () {

	}
}
