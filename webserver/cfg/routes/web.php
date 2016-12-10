<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| This file is where you may define all of the routes that are handled
| by your application. Just tell Laravel the URIs it should respond
| to using a Closure or controller method. Build something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/fblogin', function () {
	return view('fblogin');
});

Route::get('/landing', function () {
	return view('landing');
});

Route::get('/auth/facebook', 'AuthController@handle');

Route::get('/auth/facebook/redirect', 'AuthController@redirect');

Route::get('/imagetest', 'ImageController@index');

Route::get('/fbFindRelationships', 'FbController@findRelationshipId');