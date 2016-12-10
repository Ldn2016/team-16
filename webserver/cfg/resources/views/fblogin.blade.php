@extends('welcome')

@section('content')
	<div class="row">
	      <div class="col-md-6 col-md-offset-3">
	      	<h2>Login Using Facebook</h2>
	          <h2><a class="btn btn-primary" href="{{ url('auth/facebook') }}">Facebook</a></h2>
	      </div>
	  </div>

@endsection