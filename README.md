# flexigin

flexigin is a flexible framework for building simple, fast and powerful apps based on top of [Knockout](http://knockout.com).

In contrast to many other libraries which are client-side only, flexigin also has a server part.

- Node.js implementation - [flexigin-node](https://github.com/goloroden/flexigin-node)
- .NET implementation - [flexigin-net](https://github.com/robbz/flexigin-net)

## What is flexigin?

As we have seen, flexigin has a client and a server part. First of all, lets take a look at the main concept:

Assuming to have an app for editing users and their profiles, then this means to have a user and a profile model and view.
This model + view + some css stuff alltogheter are one component.

Flexigin expect them to be in a basePath like `/components` and to have the subfolders called like the name of the component should be.

    /components/user
        /user.js
        /user.html
        /user.css
        /profile
            /profile.js
            /profile.html
            /profile.css

When the client would like to get access to this components, it simple loads the files needed and automatically bind the model to the view.
The server should be at least able to provide one specified component or all components togheter.
It doesn't matter how many .js, .css or .html files there are, the result is returned **concatenated** and **minified**.

#### Examples

    /components/user/js      => all js files located in the /user folder, concatenated and minified.
    /components/profile/html => all html files located in the /user/profile folder, concatenated and minified.
    /components/css          => all css files located in the basePath /components (including all subfolders).
    /components/             => if no type is specified, a requests for each type will be created.

## Quick start

Simple call:

    fx('user', function() {
        // All the files needed for the user component have been loaded.
    });

Call with the container option:
The container is a jQuery selector where the loaded html should be appended:

    fx('user', { container: '#user' }, function() {

    });

Call with model-binding:
The model binding is a function which will be applied with knockout.
If also the container is specified, this means it will be only bind to the partial view.

    fx('user', { viewModel: function() { return fx.user; }, container: '#user' }, function() {

    });

Changing the route:
The route has two placeholders, {component} and {type}.

    fx.set('route', '/flexigin/?p={component}/{type}/'); // .NET route
    fx.set('route', '/basePath/{component}/{type}/'); // Node.js route

## Partial views

If you have a small app, then it's not a problem to load all the files on the begin, since they are minified.

    // Load all
    fx(function() {

    });

But if your app is going to get bigger from time to time, than it's better to use partial views, means to only load the component desired.

    // Load the js of the profile component
    fx('user/profile/js', function() {})

## Running the tests

Flexigin has been developed using TDD. To run the tests, you need to start the sample node app (app.js) and open the following url in your browser:

    http://localhost:3000/runner.html

## License

The MIT License (MIT)
Copyright (c) 2013 Roberto Bez.
 
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.