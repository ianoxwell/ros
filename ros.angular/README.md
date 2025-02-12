# CookBook

This project is designed to assist in stocking up your pantry to enable you to create many meals, converting cups to kg etc. Originally intended for school's Food Science programs it has been adapted for the long term planner / provisioner. <br/>
[Demo Github](https://ianoxwell.github.io/ProVisionCookbook) - sign in with your Google credentials or use<br/>
email: gordon@test.com<br/>
pw: fakePassword

## Technology used in front end
Angular 12+<br/>
Angular Material 12+<br/>
rxjs 6.6.x<br/>
auth0 JWT<br/>
Deployed to Github pages<br/>

## Server side
API written in .NET 5.0<br/>
MsSql database updated with Entity First Framework<br/>
Azure hosted services: App Service, SQL Database, Storage Account and Application Insights<br/>
Auth using Google as a social provider and API provided JWT<br/>
Recipes and ingredients from Spoonacular api (thank you) - https://spoonacular.com/food-api<br/>
Raw ingredient / nutritional Data sourced from the Usda Food database<br/>

## Development server
Run `ng serve --ssl` for a dev server. Navigate to `https://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build/Deploy

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--configuration production` flag for a production build.<br/>
deploy to github pages `ng deploy --base-href "https://ianoxwell.github.io/ProVisionCookbook/"`

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

