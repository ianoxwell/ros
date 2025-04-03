# Recipe Ordering Simplified (ROS)

This full stack project is designed to assist in stocking up your pantry to enable you to create many meals, converting cups to kg etc. Originally intended for multiple school's Food Science programs it has been adapted for the long term planner / provisioner.  
Over the years it has essentially been a project to continue to hone skills and techniques outside of any work projects. Previously called Provisioners Cookbook.

Mono repo style with everything strictly typed from the BE through to the front end sharing models/interfaces
Angular and React pages hosted on GH-pages using gh-page deploy from prebuilt folder

Why was it interesting building same thing in Angular and React
Benefits of controlling the whole stack

## API - NextJS and Postgres

[API Swagger Page](https://api-ros.fly.dev/api)  
[Further details](https://github.com/ianoxwell/ros/blob/main/ros.api/README.md)

### API Technologies used

* NestJs 11+ - The api controllers
* TypeOrm - The connector to the database
* PostGres - The database
* Axios - external api communication
* Fly.io - where it is hosted
* Auth0 - social logon provider

## Angular - Provisioner's Cookbook

[Provisioners Cookbook](https://ianoxwell.github.io/ros/angular-app)  
[Further Details](https://github.com/ianoxwell/ros/blob/main/ros.angular/README.md)
  
Provisioners Cookbook was started as a personal project many years ago with a dark and coffee coloured theme. Although now a somewhat dated design it show cases that a dark theme can still be WCAG 2.0 AA contrast friendly. The project's scope has been limited to effectively Recipes and Ingredients

As a sailor we often provision for months at a time, so the concept here was to create a base of recipes that we like to cook in order to find out how many kg, jars or bags of a certain item that we would need in order to cook for the entire crew for the period of time we are offshore.

### Angular Technologies used

* Angular 19+
* Angular Material 19+ - Angular implementation of Google Material 3
* Signals - really simplifies a lot of use cases of observables
* RxJs - the observable backbone pattern of Angular up to v16
* Jasmine/Karma unit tests
* Auth0

## ROS - React current version of ROS

[ROS](https://ianoxwell.github.io/ros/react-app)  
[Further Details](https://github.com/ianoxwell/ros/blob/main/ros.react/README.md)

ROS was built essentially to learn latest react and the design is a light contrast friendly themed mobile first with a bottom aligned toolbar

### React Technologies used

* React 19+
* Mantine 7+ - React UI Front end library
* Reduxjs toolkit 2+ - really lightweight way of building the redux pattern
* Lucide - for icons (How to know that one is a Front end focused developer - well they get exited about icon sets)
* Vite - build tool
