# Recipe Ordering Simplified - api

<https://auth0.com/blog/node-js-and-typescript-tutorial-build-a-crud-api/>

* Typescript
* Express -> Nest.js??
  * <https://docs.nestjs.com/techniques/database>
* Swagger - @nestjs/swagger
  * <https://docs.nestjs.com/openapi/introduction>
* TypeOrm
* Redis - in memory cache - check?
* Postgres - pg
* Auth0 - <https://auth0.com/blog/developing-a-secure-api-with-nestjs-adding-authorization/>
* Deploy fly.toml / Dockerfile

Try tsoa for documentation on Swagger
<https://github.com/lukeautry/tsoa>
example - <https://rsbh.dev/blog/rest-api-with-express-typescript>

## Git init process

`git init`
commit untracked files
`git remote add origin https://github.com/ianoxwell/api-ros.git`
`git push -u origin main`

## Fly.io notes

 `iwr https://fly.io/install.ps1 -useb | iex` - install script for flyctl
 `flyctl auth login` - auth with your own fly.io account
`flyctl launch`
Followed this video from Harrison - <https://www.youtube.com/watch?v=Cl9jRuX1eL0>
along with these two dockerFiles:

* <https://github.com/Saluki/nestjs-template/blob/master/Dockerfile>
* <https://github.com/fly-apps/fly-nestjs/blob/main/.fly/Dockerfile>

Using Dbeaver as local postGres to connect to the fly proxy

## Nest

### Installation

`nest new api-ros`
`cd .\api-ros\src`
`nest generate module ingredient`
`nest generate class ingredient --no-spec`
`nest generate controller ingredient`

### Running the app

```bash
# development
$ npm run start

# watch mode - with the proxy to the db set
$ flyctl proxy 5432 -a api-ros-db
$ npm run start:dev

# Seed mode - runs seed.ts
$ flyctl proxy 5432 -a api-ros-db
$ npm run seed

# production mode
$ npm run start:prod

# update the api on fly.io
$ fly deploy
```

Notes on deploy <https://fly.io/docs/launch/deploy/>

`http://localhost:8080/api#` - will get you the swagger documents
api is accessible as normal at localhost:8080 for local dev
`https://api-ros.fly.dev` - should be the online api (note that the machine will need an ip assigned?) 
`flyctl ips allocate-v4` - might be a cost though...

## Postgres problem solving

You have DBeaver installed that is happy to connect to the proxy and show you contents of the DB
<https://fly.io/apps/api-ros-db>

``` bash
# check status of machines
$ fly checks list -a api-ros-db

# if the machine has not started
$ fly m start 24d89024a06587 -a api-ros-db
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

      # "EmailFrom": "cookbook@gmail.com", // https://www.hostinger.com/tutorials/how-to-use-free-google-smtp-server
      # "JwtLifetime": 1440,
      # "JwtRefreshLifetime": 720,
      # "LockOutTime": 20,
      # "MaxLoginAttempts": 5,
      # "PageSize": 25,

## Next steps

* Create role access - https://docs.nestjs.com/security/authorization
* Create the recipe entity and sync with seeder
* Create a controller for talking with spoonacular
  * DONE - get random recipe
  * get the associated ingredients and save each along with multiple conversions for each
* Complete ingredients controller
  * get all paginated,
  * suggestions list
  * filtered results (search)
  * get by id
  * check-name is available
  * post ingredient (create) - possibly update as well?
  * delete - mark as inactive
* Recipe
  * get by id
  * update recipe
  * delete - mark as inactive
  * post - create new recipe
  * search (filter, paginated results)
  * suggestion - id, name result
  * check-name is available
* Schedule recipe
  * get current schedules (times booked) - self (date between filter)
  * admin only get schedules (other users)
  * create booking / update
  * delete booking
* Users
  * Google login
  * Google register
  * admin only - toggle status
  * admin only - add user role (admin only really)
  * admin only - all users list
  * admin only - view users profile (including recipes)
