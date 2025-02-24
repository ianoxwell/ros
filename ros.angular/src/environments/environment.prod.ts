declare const require: any;

export const environment = {
  production: true,
  baseURL: 'https://ianoxwell.github.io/ProVisionCookbook/',
  apiUrl: 'https://api-ros.fly.dev/',
  apiVersion: '/api/v1/',
  version: require('../../package.json').version,
  resultsPerPage: 10
};
