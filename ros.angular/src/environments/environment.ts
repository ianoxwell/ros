// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.
declare const require: any;

export const environment = {
  production: false,
  baseURL: 'https://localhost:4200/',
  version: require('../../package.json').version,
  apiUrl: 'http://localhost:8080',
  apiVersion: '/api/v1/',
  resultsPerPage: 10
};
