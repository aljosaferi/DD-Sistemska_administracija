const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongoose').Types;

const uri = "mongodb+srv://admin:sSIqaEnhN9pQ4r3T@studentskaprehrana.acigcoy.mongodb.net/test?retryWrites=true&w=majority&appName=studentskaPrehrana";
const client = new MongoClient(uri);

import supertest from "supertest";
import app from "../app";

async function resetDatabase() {
  try {
    await client.connect();
    const db = client.db("test");
    await db.dropDatabase();
  } catch (error) {
    console.error('Failed to reset database:', error);
  } finally {
    await client.close();
  }
}

async function addAdminUser() {
  try {
    const response = await supertest(app).post(`/users`).send({
      username: "admin",
      firstName: "firstName",
      lastName: "lastName",
      email: "firstName.lastName@gmail.com",
      password: "password",
      userType: "regular"
    }).expect(201);

    const userID = response.body._id;

    await client.connect();
    const db = client.db("test");

    await db.collection('users').updateOne(
      { _id: new ObjectId(userID) },
      { $set: { userType: "admin" } }
    );
  } catch (error) {
    console.error('Failed to add admin user:', error);
  } finally {
    await client.close();
  }
}

async function addRegularUser() {
  try {
    const response = await supertest(app).post(`/users`).send({
      username: "username",
      firstName: "firstName",
      lastName: "lastName",
      email: "firstName.lastName@gmail.com",
      password: "password",
      userType: "regular"
    }).expect(201);
  } catch (error) {
    console.error('Failed to add regular user:', error);
  }
}

async function addRestaurantOwner() {
  try {
    const response = await supertest(app).post(`/users`).send({
      username: "restaurantOwner",
      firstName: "firstName",
      lastName: "lastName",
      email: "firstName.lastName@gmail.com",
      password: "password",
      userType: "restaurantOwner"
    }).expect(201);
    return response.body._id;
  } catch (error) {
    console.error('Failed to add regular user:', error);
  }
}

async function approveUser(restaurantOwnerID) {
  const adminLoginResponse = await supertest(app).post(`/users/login`).send({
      username: "admin",
      password: "password",
  }).expect(200);

  let adminCookie = adminLoginResponse.headers['set-cookie'];

  await supertest(app).put(`/users/approveRestaurantOwner/${restaurantOwnerID}`).set('Cookie', adminCookie).expect(201);
}

async function addRestaurant() {
  const userLoginResponse = await supertest(app).post(`/users/login`).send({
    username: "restaurantOwner",
    password: "password",
  }).expect(200);

  let cookie = userLoginResponse.headers['set-cookie'];

  const response = await supertest(app).post(`/restaurants`).set('Cookie', cookie).send({
      name: "Mcdonalds",
      address: "Tržaška cesta, Maribor",
      mealPrice: 8.99,
      mealSurcharge: 3.99,
      workingHours: [
          {
              day: "Ponedeljek",
              open: "12:30",
              close: "20:00"
          },
          {
              day: "Torek",
              open: "12:30",
              close: "20:00"
          },
      ],
  }).expect(201);

  return response.body._id;
}

async function addTag() {
  const userLoginResponse = await supertest(app).post(`/users/login`).send({
    username: "admin",
    password: "password",
  }).expect(200);

  let cookie = userLoginResponse.headers['set-cookie'];

  const response = await supertest(app).post(`/tags`).set('Cookie', cookie).send({
    name: "Vegansko",
  }).expect(201);

  return response.body._id;
}


module.exports = { resetDatabase, addAdminUser, addRegularUser, addRestaurantOwner, approveUser, addRestaurant, addTag };