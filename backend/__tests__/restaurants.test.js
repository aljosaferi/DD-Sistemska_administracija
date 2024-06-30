import supertest from "supertest";
import app from "../app";
import restaurantModel from "../models/restaurantModel";
const mongoose = require('mongoose');

const { resetDatabase, addAdminUser, addRegularUser, approveUser} = require('./jest.resetDatabase');

let cookie;
let userID;
let createdRestaurantID;

const expectedRestaurantKeys = [
    "name",
    "address",
    "owner",
    "mealPrice",
    "mealSurcharge",
    "workingHours",
    "tags",
    "location",
    "ratings",
    "_id",
    "__v",
    "id"
];

beforeAll(async () => {
  await resetDatabase();
  await addAdminUser();
  await addRegularUser();

  const addUserResponse = await supertest(app).post(`/users`).send({
    username: "restaurantOwner",
    firstName: "firstName",
    lastName: "lastName",
    email: "firstName.lastName@gmail.com",
    password: "password",
    userType: "restaurantOwner"
    }).expect(201)

    userID = addUserResponse.body.id;

    const loginResponse = await supertest(app).post(`/users/login`).send({
        username: "restaurantOwner",
        password: "password",
    }).expect(200);
    cookie = loginResponse.headers['set-cookie'];
});

describe("Restaurants", () => {
    describe("└>POST", () => {
        describe("Post restaurant", () => {
            describe("given user isn't logged in", () => {
                it("should return a 404", async () => {
                    const response = await supertest(app).post(`/restaurants`).send({
                        name: "Mcdonalds",
                        address: "Tržaška cesta, Maribor",
                        mealPrice: 8.99,
                        mealSurcharge: 3.99,
                        workingHours: [
                            {
                                day: "Ponedeljek",
                                open: "12:30",
                                close: "20.00"
                            },
                            {
                                day: "Torek",
                                open: "12:30",
                                close: "20.00"
                            },
                        ],
                    });

                    expect(response.statusCode).toBe(404);
                });
            });
            describe("given user is a pending approval", () => {
                it("should return a 401", async () => {
                    const response = await supertest(app).post(`/restaurants`).set('Cookie', cookie).send({
                        name: "Mcdonalds",
                        address: "Tržaška cesta, Maribor",
                        mealPrice: 8.99,
                        mealSurcharge: 3.99,
                        workingHours: [
                            {
                                day: "Ponedeljek",
                                open: "12:30",
                                close: "20.00"
                            },
                            {
                                day: "Torek",
                                open: "12:30",
                                close: "20.00"
                            },
                        ],
                    });

                    expect(response.statusCode).toBe(401);
                });
            });

            describe("given everything is okay", () => {
                it("should return a 201", async () => {

                    await approveUser(userID);

                    const userLoginResponse = await supertest(app).post(`/users/login`).send({
                        username: "restaurantOwner",
                        password: "password",
                    }).expect(200);

                    cookie = userLoginResponse.headers['set-cookie'];

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
                    });

                    expect(response.statusCode).toBe(201);
                    
                    expectedRestaurantKeys.forEach(key => {
                        expect(response.body).toHaveProperty(key);
                    });

                    expect(response.body.name).toBe("Mcdonalds");
                    expect(response.body.address).toBe("Tržaška cesta, Maribor");
                    expect(response.body.mealPrice).toBe(8.99);
                    expect(response.body.mealSurcharge).toBe(3.99);
                    expect(response.body.mealSurcharge).toBe(3.99);
                    expect(response.body.owner).toBe(userID);

                    createdRestaurantID = response.body.id;
                });
            });
        });

        describe("Rate restaurant", () => {
            describe("given user isn't logged in", () => {
                it("should return a 404", async () => {
                    await supertest(app).post(`/restaurants/${createdRestaurantID}/rate?score=4`).expect(404);
                });
            });
            describe("given restaurant doesn't exist", () => {
                it("should return a 404", async () => {
                    const nonExistentRestaurantId = new mongoose.Types.ObjectId().toString();

                    await supertest(app).post(`/restaurants/${nonExistentRestaurantId}/rate?score=4`).expect(404);
                });
            });
            describe("given rating is not between 1-5", () => {
                it("should return a 500", async () => {
                    await supertest(app).post(`/restaurants/${createdRestaurantID}/rate?score=100`).set('Cookie', cookie).expect(500);
                });
            });
            describe("given everything is okay", () => {
                it("should return a 200", async () => {
                    const response = await supertest(app).post(`/restaurants/${createdRestaurantID}/rate?score=5`).set('Cookie', cookie).expect(200);

                    expect(response.body.ratings).toContainEqual(expect.objectContaining({ score: 5 }));
                });
            });
        });
    });

    describe("└>PUT", () => {
        describe("Edit restaurant", () => {
            describe("given everything is okay", () => {
                it("should return a 200", async () => {
                    const response = await supertest(app).put(`/restaurants/${createdRestaurantID}`).set('Cookie', cookie).send({
                        name: "Mcdonalds Europark",
                        address: "Pobreška cesta 18, Maribor",
                        mealPrice: 8.99,
                        mealSurcharge: 3.99,
                        workingHours: [
                            {
                                day: "Ponedeljek",
                                open: "9:00",
                                close: "20:00"
                            },
                            {
                                day: "Torek",
                                open: "9:00",
                                close: "20:00"
                            },
                        ],
                    }).expect(200);

                    expectedRestaurantKeys.forEach(key => {
                        expect(response.body).toHaveProperty(key);
                    });

                    expect(response.body.name).toBe("Mcdonalds Europark");
                    expect(response.body.address).toBe("Pobreška cesta 18, Maribor");
                    expect(response.body.mealPrice).toBe(8.99);
                    expect(response.body.mealSurcharge).toBe(3.99);
                    expect(response.body.mealSurcharge).toBe(3.99);
                    expect(response.body.owner).toBe(userID);
                });
            });
        });
    });

    describe("└>GET", () => {
        describe("get all restaurants", () => {
            it("should return a 200", async () => {
                await supertest(app).get(`/restaurants`)
                .expect(200)
                .expect('Content-Type', /json/)
                .expect((res) => {
                    if (!Array.isArray(res.body)) {
                        throw new Error("Response body is not an array");
                    }
    
                    res.body.forEach(restaurant => {
                        expectedRestaurantKeys.forEach(key => {
                            if (!(key in restaurant)) {
                                throw new Error(`Missing key ${key} in user object`);
                            }
                        });
                    });
                })
            })
        })

        describe("get all restaurants near - Maribor", () => {
            it("should return a 200", async () => {
                await supertest(app).get(`/restaurants/near?distance=10000`)
                .expect(200)
                .expect('Content-Type', /json/)
                .expect((res) => {
                    if (!Array.isArray(res.body)) {
                        throw new Error("Response body is not an array");
                    }

                    const hasCreatedRestaurant = res.body.some(restaurant => restaurant.id === createdRestaurantID);
                    if (!hasCreatedRestaurant) {
                        throw new Error(`Restaurant with ID ${createdRestaurantID} is not in the response`);
                    }
                })
            })
        })

        describe("get all restaurants from user", () => {
            it("should return a 200", async () => {
                await supertest(app).get(`/restaurants/from/${userID}`)
                .expect(200)
                .expect('Content-Type', /json/)
                .expect((res) => {
                    if (!Array.isArray(res.body)) {
                        throw new Error("Response body is not an array");
                    }

                    const hasCreatedRestaurant = res.body.some(restaurant => restaurant.id === createdRestaurantID);
                    if (!hasCreatedRestaurant) {
                        throw new Error(`Restaurant with ID ${createdRestaurantID} is not in the response`);
                    }
                })
            })
        })

        describe("get restaurant", () => {
            describe("given the user doesn't exist", () => {
                it("should return a 404", async () => {
                    const nonExistentRestaurantId = new mongoose.Types.ObjectId().toString();
    
                    await supertest(app).get(`/restaurants/${nonExistentRestaurantId}`).expect(404)
                })
            })
            describe("given everything is okay", () => {
                it("should return a 200", async () => {    
                    await supertest(app).get(`/restaurants/${createdRestaurantID}`).expect(200)
                })
            })
        })
    }); 

    describe("└>DELETE", () => {
        describe("delete restaurant", () => {
            describe("given user isn't this restaurants owner", () => {
                it("should return a 401", async () => {
                    const userLoginResponse = await supertest(app).post(`/users/login`).send({
                        username: "username",
                        password: "password",
                    }).expect(200);

                    cookie = userLoginResponse.headers['set-cookie'];

                    await supertest(app).delete(`/restaurants/${createdRestaurantID}`).set('Cookie', cookie)
                    .expect(401)
                })
            })
            describe("given everything is okay", () => {
                it("should return a 204", async () => {
                    const userLoginResponse = await supertest(app).post(`/users/login`).send({
                        username: "restaurantOwner",
                        password: "password",
                    }).expect(200);

                    cookie = userLoginResponse.headers['set-cookie'];

                    await supertest(app).delete(`/restaurants/${createdRestaurantID}`).set('Cookie', cookie)
                    .expect(204)
                                        
                    await supertest(app).get(`/restaurants/${createdRestaurantID}`)
                    .expect(404);
                })
            })
        })
    })
});