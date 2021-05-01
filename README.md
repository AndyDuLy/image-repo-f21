# Cloud Image Repository REST API

REST API for an image repository, built for the [Shopify Challenge, Fall 2021](https://docs.google.com/document/d/1ZKRywXQLZWOqVOHC4JkF3LqdpO3Llpfk_CkZPR8bjak/edit). <br/>

# Features

  - User Registration, Login, JSON Web Token Authentication
  - Users can ```GET```, ```POST```, ```DELETE``` Images
  - SwaggerUI API Documentation
  - Jest, Supertest Unit Tests

# Tech Stack

- Nodejs with Express, JWT Authentication <br/>
- MongoDB Atlas with Mongoose, AWS S3 Bucket for Image Storage <br/>
- Swagger UI <br/>
- Jest, Supertest <br/>

# Installation (local)

If you'd like to clone this API and use it yourself, you can do so with the following steps:

1. Clone the project
2. Install dependencies
3. Create a [MongoDB Atlas account](https://account.mongodb.com/account/register?nds=true)
4. Create an [Amazon Web Services account](https://portal.aws.amazon.com/billing/signup#/start)
5. Create an .env file, and the following variables: 
  - ###### MONGO_URI , MONGO_URI_TEST , JWT_SECRET , AWS_ACCESS_KEY_ID , AWS_SECRET_KEY , AWS_BUCKET_NAME , AWS_REGION
6. Add the following snippet to your ```package.json```:
  ```
  "scripts": {
    "start": "nodemon src/server.js",
    "test": "jest --runInBand --detectOpenHandles"
  },
  ```
7. Run ```npm start```, and your API will be served at ```localhost:3000``` !
  - 7.1 When the server is live, visit ```localhost:3000/api-docs``` for the Swagger UI docs!
  - 7.2 Run ```npm test```, to run the Jest/Supertest Unit Tests!
  
# API Documentation

| HTTP Method   | Endpoint            | Description                                | Request Parameters
|:--------------|:--------------------|:-------------------------------------------|:--------------------------------------------
| POST          | /auth/signup        | Endpoint for registering new users         | **email**: _string_, **password**: _string_
| POST          | /auth/login         | Endpoint for logging in existing users     | **email**: _string_, **password**: _string_
| GET           | /images/getImage    | Endpoint for getting all images for a user | _*jwt token*_, **userid**: _string_
| POST          | /images/newImage    | Endpoint for uploading an image to S3      | _*jwt token*_, **userid**: _string_, **image**: file
| DELETE        | /images/deleteImage | Endpoint for deleting an image from S3     | _*jwt token*_, **userid**: _string_, **imagekey**: string, <br/> **imageid**: string

# Future Features

  - Docker Containerization
  - CI/CD Pipeline, Automate Testing
  - Host API
