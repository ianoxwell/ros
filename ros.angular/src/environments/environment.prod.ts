declare const require: any;

export const environment = {
  production: true,
  baseURL: 'https://ianoxwell.github.io/ProVisionCookbook/',
  apiUrl: 'https://cookbook-api.azurewebsites.net',
  apiVersion: '/api/v1/',
  version: require('../../package.json').version,
  resultsPerPage: 10
};
