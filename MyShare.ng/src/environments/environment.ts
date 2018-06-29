// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,

  //create your firebase project and put its configuration and URI here.

  firebase: {
    apiKey: 'AIzaSyAgbnSmURIXzlUg5mVgr4NQOG1gpQkZb4c',
    authDomain: 'expenses-f5bc0.firebaseapp.com',
    databaseURL: 'https://expenses-f5bc0.firebaseio.com',
    projectId: 'expenses-f5bc0',
    storageBucket: 'expenses-f5bc0.appspot.com',
    messagingSenderId: '509254444814'

  },

  fireFunctionsUrl: ''
};
