# Directory Structure and Uses

## Client

### public
This folder will contain any images we want to include in our UI, along with the index.html file.

### src
App.js will be the parent container of all other containers. This is basically what will control what goes where in our UI.

This folder will contain all the js files for our front end. 

## Server

### server.js
This file is what runs when we start our server. It calls conn.js to initialize the connection to the database (running "node server.js" will start the server).

### db
This folder contains one file – conn.js – which basically initializes the connection between the mongoDB and the server.

### routes
This folder will contain any Server API Endpoints. Basically, this is where we interact with the database, using Express.js. There are sample endpoints in record.js which are just examples of what an API endpoint might look like.

### config.env
This file is where we set which port we run the server on. Additionally, we provide the URI for the connection to the Mongo database which requires your username and password.

# Running on local machine
Because the node_modules folder is extremely large, it is not on the repository. Therefore, when cloning the repository onto your local machine, go to the server directory and run "npm i" to get this folder. Do the same in the client repository.
