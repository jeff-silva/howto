@extends('app')

@section('content')
    <div>
        <a href="/">Home</a>
        - <a href="/uid/{{ uniqid() }}">New UID</a>
        - {{ $uid }}
    </div>
@endsection
