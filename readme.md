Steps to run the app - 

1. Clone the repository from github.

2. move in to the directory in the cmd , and npm install and run     node app.js

3. To test the API's , you can use POSTMAN

4. API's - 
    1. Register Route - localhost:3000/register
        payload : {
            "name":"",
            "email":"",
            "password":""
        }

    2. localhost:3000/login
        payload: {
            "email":"",
            "password":""
        }

5. App brief: 
    Whenever you will register on app , you will geta verifivation email ,you need to verify your email first before login.