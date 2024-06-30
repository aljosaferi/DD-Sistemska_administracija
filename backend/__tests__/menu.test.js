import supertest from "supertest";
import app from "../app";
const mongoose = require('mongoose');

const { resetDatabase, addAdminUser, addRegularUser, addRestaurantOwner, approveUser, addRestaurant, addTag } = require('./jest.resetDatabase');

let restaurantOwnerID;
let restaurantID;
let tagID;

beforeAll(async () => {
  await resetDatabase();

  await addAdminUser();
  await addRegularUser();
  restaurantOwnerID = await addRestaurantOwner();
  await approveUser(restaurantOwnerID);
  restaurantID = await addRestaurant();
  tagID = await addTag();
})

const expectedKeys = [
    "dish",
    "sideDishes",
    "restaurant",
    "tag",
];


describe("menus", () => {
    let createdID;
    let cookie;
    describe("└>POST", () => {
        describe("post menu", () => {
            describe("given user isn't logged in", () => {
                it("should return a 404", async () => {
                    await supertest(app).post(`/menus`).send({
                        dish: "McChicken",
                        sideDishes: ["Pomfri", "Cocacola 0.5L"],
                        restaurantId: restaurantID,
                        tag: tagID
                    }).expect(404); 
                });
            });
            describe("given user isn't an admin", () => {
                it("should return a 401", async () => {
                    const userLoginResponse = await supertest(app).post(`/users/login`).send({
                        username: "username",
                        password: "password",
                    }).expect(200);

                    cookie = userLoginResponse.headers['set-cookie'];

                    await supertest(app).post(`/menus`).set('Cookie', cookie).send({
                        dish: "McChicken",
                        sideDishes: ["Pomfri", "Cocacola 0.5L"],
                        restaurantId: restaurantID,
                        tag: tagID
                    }).expect(401); 
                });
            });
            describe("given everything is okay", () => {
                it("should return a 201", async () => {
                    const userLoginResponse = await supertest(app).post(`/users/login`).send({
                        username: "admin",
                        password: "password",
                    }).expect(200);

                    cookie = userLoginResponse.headers['set-cookie'];

                    const response = await supertest(app).post(`/menus`).set('Cookie', cookie).send({
                        dish: "McChicken",
                        sideDishes: ["Pomfri", "Cocacola 0.5L"],
                        restaurantId: restaurantID,
                        tag: tagID
                    }).expect(201);

                    createdID = response.body._id;
                });
            });
        })
    })

    describe("└>PUT", () => {
        describe("edit menu", () => {
            describe("given user isn't logged in", () => {
                it("should return a 404", async () => {
                    await supertest(app).put(`/menus/${createdID}`).send({
                        dish: "BigMac",
                        sideDishes: ["Pomfri", "Cocacola 0.5L"],
                        restaurantId: restaurantID,
                        tag: tagID
                    }).expect(404);
                })
            })

            describe("given everything is okay", () => {
                it("should return a 201", async () => {
                    const response = await supertest(app).put(`/menus/${createdID}`).set('Cookie', cookie).send({
                        dish: "BigMac",
                        sideDishes: ["Pomfri", "Cocacola 0.5L"],
                        restaurantId: restaurantID,
                        tag: tagID
                    }).expect(201);

                    expectedKeys.forEach(key => {
                        expect(response.body).toHaveProperty(key);
                    });
            
                    expect(response.body.dish).toBe("BigMac");
                    expect(response.body.id).toBe(createdID);
                })
            })
        })
    })

    describe("└>GET", () => {
        describe("get menus", () => {
            it("should return a 200", async () => {
                await supertest(app).get(`/menus`)
                .expect(200)
                .expect('Content-Type', /json/)
                .expect((res) => {
                    if (!Array.isArray(res.body)) {
                        throw new Error("Response body is not an array");
                    }
    
                    res.body.forEach(menu => {
                        expectedKeys.forEach(key => {
                            if (!(key in menu)) {
                                throw new Error(`Missing key ${key} in user object`);
                            }
                        });
                    });
                })
            })
        })

        describe("get menu", () => {
            describe("given the menu doesn't exist", () => {
                it("should return a 404", async () => {
                    const nonExistentMenuId = new mongoose.Types.ObjectId().toString();
    
                    await supertest(app).get(`/menus/${nonExistentMenuId}`).expect(404)
                })
            })
            describe("given everything is okay", () => {
                it("should return a 200", async () => {
                    await supertest(app).get(`/menus/${createdID}`).expect(200)
                })
            })
        })
    })

    describe("└>DELETE", () => {
        describe("delete menu", () => {
            describe("given user isn't a admin", () => {
                it("should return a 401", async () => {
                    const userLoginResponse = await supertest(app).post(`/users/login`).send({
                        username: "username",
                        password: "password",
                    }).expect(200);

                    cookie = userLoginResponse.headers['set-cookie'];

                    await supertest(app).delete(`/menus/${createdID}`).set('Cookie', cookie)
                    .expect(401)
                })
            })
            describe("given everything is okay", () => {
                it("should return a 204", async () => {
                    const userLoginResponse = await supertest(app).post(`/users/login`).send({
                        username: "admin",
                        password: "password",
                    }).expect(200);

                    cookie = userLoginResponse.headers['set-cookie'];

                    await supertest(app).delete(`/menus/${createdID}`).set('Cookie', cookie)
                    .expect(204)
                                        
                    await supertest(app).get(`/menus/${createdID}`)
                    .expect(404);
                })
            })
        })
    })
})