require("dotenv").config();
const mongoose = require("mongoose");
const express = require('express');
const http = require('http');
const routes = require('../Routes/index');
const supertest = require("supertest");

const app = express();
const server = http.createServer(app);
app.use(express.json());
app.use(routes);
server.listen(3000, () => { console.log("server listening on port 3000"); })


beforeEach(async (done) => {
  mongoose.connect(process.env.MONGO_URI_TEST,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => done());

  jest.setTimeout(15000)
});

afterAll((done) => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(() => done())
  });

  server.close();
});


let jwtToken,
    userID,
    imageID,
    imageKey;

let filePath = 'C:/Users/aduly-ideapad/Desktop/shopify-f21/BE/src/Tests/test-images/aws.png',
    invalidFileType = 'C:/Users/aduly-ideapad/Desktop/shopify-f21/BE/src/Tests/test-images/not_img.txt';

async function setup() {
  await supertest(app)
    .post("/auth/signup")
    .send({
      email: 'test@email.com',
      password: 'password'
    })

  await supertest(app)
    .post("/auth/login")
    .send({
      email: 'test@email.com',
      password: 'password'
    })
    .then((res) => {
      jwtToken = res.body.token;
      userID = res.body.user._id
    })
}


// Test Image Upload and Delete, Valid
test('POST /images/newImage, DELETE /images/deleteImage (Valid Requests)', async () => {
  await setup();

  await supertest(app)
    .post("/images/newImage")
    .set({ 'Authorization': jwtToken })
    .attach('image', filePath)
    .field({ 'userID': userID })
    .expect(201)
    .then((res) => {
      expect(res.body.message).toBe("Image Uploaded Successfully")
      expect(res.body.image_url).toBeDefined()
      imageID = res.body.imageID;
      imageKey = res.body.image_key;
    })

  await supertest(app)
    .delete("/images/deleteImage")
    .set({ 'Authorization': jwtToken })
    .send({
      imageKey: imageKey,
      imageID: imageID,
      userID: userID
    })
    .expect(200)
    .then((res) => {
      expect(res.body.message).toBe("Image deleted successfully")
    })
});

// Test Invalid File Type Upload
test('POST /images/newImage (Invalid File Type, Not Image)', async () => {
  await setup();

  await supertest(app)
    .post("/images/newImage")
    .set({ 'Authorization': jwtToken })
    .attach('image', invalidFileType)
    .field({ 'userID': userID })
    .expect(415)
    .then((res) => {
      expect(res.body.error).toBe("Inputted file is not an accepted image type")
    })
});

// Test Invalid Upload Request, Missing UserID
test('POST /images/newImage (Missing Parameter, UserID)', async () => {
  await setup();

  await supertest(app)
    .post("/images/newImage")
    .set({ 'Authorization': jwtToken })
    .attach('image', filePath)
    .expect(400)
    .then((res) => {
      expect(res.body.error).toBe("Missing required parameter(s)")
    })
});

// Test Invalid Delete Request, Missing UserID
test('DELETE /images/deleteImage (Missing Parameter, UserID)', async () => {
  await setup();

  await supertest(app)
    .delete("/images/deleteImage")
    .set({ 'Authorization': jwtToken })
    .expect(400)
    .then((res) => {
      expect(res.body.error).toBe("Missing required parameter(s)")
    })
});

// Test Invalid Delete Request, Image Does Not Exist
test('DELETE /images/deleteImage (Image Does Not Exist)', async () => {
  await setup();

  await supertest(app)
    .delete("/images/deleteImage")
    .set({ 'Authorization': jwtToken })
    .send({
      imageKey: "invalid key",
      imageID: "invalid id",
      userID: userID
    })
    .expect(404)
    .then((res) => {
      expect(res.body.error).toBe("File does not exist")
    })
});
