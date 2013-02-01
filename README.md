Shoto [![Build Status](https://travis-ci.org/matto1990/photo_project.png)](https://travis-ci.org/matto1990/photo_project)
=========================================================

Shoto is a photo sharing service which takes photos from multiple sources and combines them into a single photo stream. The backend is written in [node.js](http://nodejs.org) and the frontend is written in [Backbone.js](http://backbonejs.org).

Testing is done in in a Behavior-driven development style using [Mocha](http://visionmedia.github.com/mocha/) and uses [Travis-ci](http://travis-ci.org) as a continuous integration server.

Getting Started
---------------

You must have these tools installed to get started:

 * [Node.js](http://nodejs.org) >= v0.8.x
 * [npm](https://npmjs.org) should be installed with node.js

You then need to install the required npm modules. From a terminal at the root of this project, run:

```
npm install
```

Running
-------

To start the server run:

```
npm start
```

And then visit the URL shown on the console to view the web application.

Testing
-------

Run all of the tests using:

```
npm test
```
