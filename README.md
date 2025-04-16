# Recipe Ordering Simplified (ROS)

**Recipe Ordering Simplified (ROS)** is a full-stack application designed to streamline pantry management and meal planning. Originally developed for multiple schools' Food Science programs, it has since evolved into a tool for long-term planners and provisioners. The application helps users calculate ingredient quantities for recipes, convert measurements (e.g., cups to kilograms), and plan meals efficiently. Over the years, this project has served as a platform to refine skills and experiment with new technologies.

This mono-repo project ensures strict typing across the backend and frontend, sharing models and interfaces for consistency. It includes both Angular and React implementations, showcasing the same functionality with different frameworks.

![Ingredient Nutrition](/assets/ingredient-screen.png "Ingredient nutrition")

## Why Build the Same Project in Angular and React?

Having extensive experience with Angular, this project was an opportunity to explore React for a larger application. React's intuitive nature made the transition straightforward. The mono-repo structure, with shared interfaces and models, significantly reduced development time and ensured consistency across the stack.

### Features

* **Meal Planning**: Book recipes into time slots (e.g., breakfast, lunch) and calculate ingredient quantities for specific durations.
* **Measurement Conversion**: Convert between units like cups, kilograms, and more.
* **Dark and Light Themes**: Angular implementation features a WCAG 2.0 AA contrast-friendly dark theme, while React offers a light, mobile-first design.
* **Social Login**: Auth0 integration for secure authentication.
* **API Documentation**: Swagger documentation for the backend API.

## API - NestJS and Postgres

The backend API is built with NestJS and PostgreSQL, providing a robust and scalable foundation for the application.

### API Features

* Controllers: Built with NestJS 11+.
* Database: PostgreSQL with TypeORM for database management.
* External API Communication: Axios for seamless integration with external services.
* Hosting: Deployed on Fly.io.
* Authentication: Auth0 for social login.
* Logging: Winston is used in conjunction with @google-cloud/logging-winston to record logs for this app

[API Swagger Page](https://api-ros.fly.dev/api)  
[Further details](https://github.com/ianoxwell/ros/blob/main/ros.api/README.md)

## Angular - Provisioner's Cookbook

The Angular implementation, Provisioner's Cookbook, was the original version of this project. It features a dark, coffee-colored theme that is WCAG 2.0 AA contrast-friendly. The implementation focuses only on recipes and ingredients.

### Angular Technologies

* **Angular 19+**: The core framework.
* **Angular Material 19+** - Angular implementation of Google Material 3
* **Signals** - simplifies observable use in a lot of cases.
* **RxJs** - Reactive programming backbone
* **Jasmine/Karma**: Unit testing framework.
* **Auth0**: Authentication provider

[Provisioners Cookbook](https://ianoxwell.github.io/ros/angular-app)  
[Further Details](https://github.com/ianoxwell/ros/blob/main/ros.angular/README.md)
  
## ROS - React current version of ROS

The React implementation, ROS, was built to explore React's capabilities. It features a light, mobile-first design with a bottom-aligned toolbar for easy navigation.

### React Technologies used

* React 19+
* Mantine 7+ - React UI Front end library
* Reduxjs toolkit 2+ - really lightweight way of building the redux pattern
* Lucide - for icons (How to know that one is a Front end focused developer - well they get exited about icon sets)
* Vite - build tool

### Future roadmap

* Complete development of scheduling
  * User will be able to schedule a recipe and quantity on a given day
  * User will be abele to edit an existing scheduled recipe
  * User to be able to add a recipe directly for scheduling from recipe vie
* Complete the implementation of the ordering/shopping calculation
  * User will be able to see all the recipes scheduled in time period (1 || 2 || 4 weeks)
  * User will have a printable list of shopping summary, e.g. 6 kg of potatoes, 3 medium pineapples
* User will be able to add a new recipe
* User will be able to edit a recipe
* Complete user settings
  * User will be able to edit their own settings including changing password

[ROS](https://ianoxwell.github.io/ros/react-app)  
[Further Details](https://github.com/ianoxwell/ros/blob/main/ros.react/README.md)
