# GroupProject_FateFour_API

## Iter 3 Notes:
We completed server-side real time chatting functionality specially routes that receives chat histories and store them in the database. See `./routes/index.js` for detailed implementation.

The data model for chat page has been finalized and implemented, see `./db/models.js` for details.

## Iter 2 Notes:
We created several routers that will work specifically with our front-end ui. 

For example:
1. `https://webproject-api.herokuapp.com/register` will accept `POST` request and stored `username`, `password` and `sex`. `password` will be encoded before being added into the database.

2. `https://webproject-api.herokuapp.com/login` will accept `POST` request and find user information with `username` and `password`.

### Test
This back-end app is up and running, you may copy-paste this link https://webproject-api.herokuapp.com in your browser and see a simple Express welcome page. For security reason, we temporarily disabled routes that directly access the database.

## Iter 1 Notes:
IMPORTANT: make sure you download `iteration-1` tag before following the instructions below. This repo has encountered significant changes since iteration 1. 
### Purpose 
  This is a MongoDB CURD restful API. Now we can perform CURD on a mongo collection hosted on Atlas, which will store all user information. This application has been deployed on Heroku. This package is meant to be used in production eventually.

  ### Test
  For local test, run `npm run devStart`. For vscode editor user, please install [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) plugin. Then you may test the CRUD APIs via `route.rest` file. Otherwise, you may use [Postman](https://www.postman.com/) app.

  For example:
  1. `GET https://group-project-db-api-jeffxi.herokuapp.com/users`: Return all user info in the entire collection.
  2. `POST https://group-project-db-api-jeffxi.herokuapp.com/users`: Create new document based on the input JSON and inserted it into the database.

  ### Development time line
  1. **July 31th**: For simplifying the UI development testing procedure, we temporarily relaxed the uniqueness requirement for `email` field (as you can see in the code implementation in `/models/userSchema`, we commented out the entire field for now). This `email` field will be indexed as the "primary key" of the collection in the future development.
