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


beforeEach((done) => {
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


// Test Signup, Valid
test('POST /auth/signup (Valid Params)', async () => {
  await supertest(app)
    .post("/auth/signup")
    .send({
      email: 'test@email.com',
      password: 'password'
    })
    .expect(201)
    .then((res) => {
      expect(res.body.message).toBe("User created successfully")
    })
});

// Test Signup, Duplicate Email
test('POST /auth/signup (Invalid Params, Duplicate Email)', async () => {
  await supertest(app)
    .post("/auth/signup")
    .send({
      email: 'test@email.com',
      password: 'password'
    })
    .expect(409)
    .then((res) => {
      expect(res.body.error).toBe("User already exists")
    })
});

// Test Signup, Invalid Params (email with no '@')
test('POST /auth/signup (Invalid Param; Email No @)', async () => {
  await supertest(app)
    .post("/auth/signup")
    .send({
      email: 'test2.email.com',
      password: 'password'
    })
    .expect(400)
    .then((res) => {
      expect(res.body.error).toBe("Email or password input is invalid")
    })
});

// Test Signup, Missing Params (email)
test('POST /auth/signup (Missing Param; Email)', async () => {
  await supertest(app)
    .post("/auth/signup")
    .send({
      password: 'password'
    })
    .expect(400)
    .then((res) => {
      expect(res.body.error).toBe("Email or password input is invalid")
    })
});

// Test Signup, Missing Params (password)
test('POST /auth/signup (Missing Param; Password)', async () => {
  await supertest(app)
    .post("/auth/signup")
    .send({
      email: 'test2@email.com'
    })
    .expect(400)
    .then((res) => {
      expect(res.body.error).toBe("Email or password input is invalid")
    })
});
