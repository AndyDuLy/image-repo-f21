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
    userID;

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

// Test Valid GET
test('GET /images/getImage (Valid GET)', async () => {
  await setup();

  await supertest(app)
    .get("/images/getImage")
    .set({ 'Authorization': jwtToken })
    .send({ userID: userID })
    .expect(200)
    .then((res) => {
      expect(res.body.message).toStrictEqual([])
    })
});

// Test Invalid GET, Missing UserID
test('GET /images/getImage (Invalid GET, Missing userID)', async () => {
  await setup();

  await supertest(app)
    .get("/images/getImage")
    .set({ 'Authorization': jwtToken })
    .expect(400)
    .then((res) => {
      expect(res.body.error).toBe("Missing userID")
    })
});
