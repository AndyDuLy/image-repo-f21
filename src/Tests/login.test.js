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


// Test Valid Login Credentials
test('POST /auth/login (Valid Credentials)', async () => {
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
    .expect(200)
    .then((res) => {
      expect(res.body.token).toBeDefined()
      expect(res.body.user).toBeDefined()
      expect(res.body.user._id).toHaveLength(24)
      expect(res.body.user.email).toBe('test@email.com')
      expect(res.body.user.images).toEqual([])
    })
});

// Test Invalid Login Credentials
test('POST /auth/login (Invalid Credentials)', async () => {
  await supertest(app)
    .post("/auth/login")
    .send({
      email: 'test@email.com',
      password: 'wrongPassword'
    })
    .expect(401)
    .then((res) => {
      expect(res.body.error).toBe("Invalid credentials")
    })
});

// Test Login, Invalid Params (email with no '@')
test('POST /auth/login (Invalid Param; Email No @)', async () => {
  await supertest(app)
    .post("/auth/login")
    .send({
      email: 'test.email.com',
      password: 'password'
    })
    .expect(400)
    .then((res) => {
      expect(res.body.error).toBe("Email or password input is invalid")
    })
});

// Test Login, Invalid Params (No user with given email)
test('POST /auth/login (Invalid Param; No user with email)', async () => {
  await supertest(app)
    .post("/auth/login")
    .send({
      email: 'test2@email.com',
      password: 'password'
    })
    .expect(401)
    .then((res) => {
      expect(res.body.error).toBe("Invalid credentials")
    })
});

// Test Login, Missing Params (email)
test('POST /auth/login (Missing Param; Email)', async () => {
  await supertest(app)
    .post("/auth/login")
    .send({
      password: 'password'
    })
    .expect(400)
    .then((res) => {
      expect(res.body.error).toBe("Email or password input is invalid")
    })
});

// Test Login, Missing Params (password)
test('POST /auth/login (Missing Param; Password)', async () => {
  await supertest(app)
    .post("/auth/login")
    .send({
      email: 'test@email.com'
    })
    .expect(400)
    .then((res) => {
      expect(res.body.error).toBe("Email or password input is invalid")
    })
});
