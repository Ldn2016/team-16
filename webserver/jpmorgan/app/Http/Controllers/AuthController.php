<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Socialite;

use App\User;

class AuthController extends Controller
{
	public function handle() 
	{
		return Socialite::driver('facebook')->redirect();
	}

    public function redirect() 
    {
    	$user = Socialite::driver('facebook')->user();

    	$newUser = User::create([
    	    'name' => $user->getName(),
    	    'access_token' => $user->token,
    	]);

    	return view('welcome')->with('user', $newUser);
    }
}
