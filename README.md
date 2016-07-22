#Generic App Skeleton
This is my app skeleton for setting up a new app project. It uses Gulp + BrowserSync to spin up a simple server and watches for changes to your HTML/SCSS/JS files.

To get started, clone this repo and run:

````
npm install
````

To run development the dev tasks run:

````
gulp
````

This will start watching for changes to your .scss, .js, and .html files and spin up a dev server.

###Build for Production
To run the built in build tasks for a production site (which includes optimizing images, concatenating + minifying your JS and CSS, copying fonts over, and cleaning up old files) run:

````
gulp build
````
