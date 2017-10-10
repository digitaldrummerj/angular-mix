# Rapid Api Development with Sails

Full working Sails application for Angular Mix Conference.

There are 4 branches that are used for the talks as follows

* 0-new-project
  * contains a freshly created project
* 0.5-generated-api
  * contains users and todo apis with no custom logic
* 1-custom-logic
  * has a built out users and todo apis with security to only see your data
  * you can only see data belongs to you
  * you have to login before you can see data
  * you have to manually go to the login/create users routes before you can see data
* 2-policies
  * is logged in and is logged out policy implemented
  * have to login before you can get data
  * errors messages generated when not logged in
* 3-final -> the completed code for the project
  * everything put together and the final solution

## Running Code

1. Install [Node](httsp://nodejs.org)
1. Install Sails

    ```javascript
    npm install -g sails
    ```

1. Clone the code
1. run `npm install`
1. checkout the branch that has the code that you want to look at
1. run `sails lift`

## Routes

### User

* GET - http://localhost:1337/user
* UPDATE - http://localhost:1337/user/id (replace id with the user id)
* POST - http://localhost:1337/user

    ```json
    {
      "email": "foo@foo.com",
      "password": "123456"
    }
    ```

* UPDATE - http://localhost:1337/user/id

  ```json
  {
    "email": "foo@foo.com",
    "password": "123456"
  }
  ```

* POST - http://localhost:1337/user/login

    ```json
    {
      "email": "foo@foo.com",
      "password": "123456"
    }
    ```

### TODO

* GET - http://localhost:1337/todo
* POST - http://localhost:1337/todo

  ```json
  {
    "item": "Your Todo Item"
  }
  ```

* PUT - http://localhost:1337/todo/id

  ```json
  {
    "item": "Your Todo Item",
    "completed": true
  }
  ```

* DELETE - http://localhost:1337/todo/id

## Workflow

1. Run `sails lift`
1. Open Postman
1. Login if user exist at http://localhost:1337/user/login or Create a user at http://localhost:1337/user
  * Body:
      * Raw
      * Type: Application/Json

      ```json
      {
        "email": "foo@foo.com",
        "password": "123456"
      }
      ```
1. Once you are logged in you can play with both the user and todo API
