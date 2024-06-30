import supertest from "supertest";
import app from "../app";
const mongoose = require('mongoose');

const { resetDatabase, addAdminUser, addRegularUser} = require('./jest.resetDatabase');

beforeAll(async () => {
  await resetDatabase();
  await addAdminUser();
  await addRegularUser();
})

const expectedKeys = [
    "name",
];


describe("tags", () => {
    let createdID;
    let cookie;
    describe("└>POST", () => {
        describe("post tag", () => {
            describe("given user isn't logged in", () => {
                it("should return a 404", async () => {
                    await supertest(app).post(`/tags`).send({
                        name: "Vegansko",
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

                    await supertest(app).post(`/tags`).set('Cookie', cookie).send({
                        name: "Vegansko",
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

                    const response = await supertest(app).post(`/tags`).set('Cookie', cookie).send({
                        name: "Vegansko",
                    }).expect(201);

                    createdID = response.body._id;
                });
            });
        })
    })

    describe("└>PUT", () => {
        describe("edit tag", () => {
            describe("given user isn't logged in", () => {
                it("should return a 404", async () => {
                    await supertest(app).put(`/tags/${createdID}`).send({
                        name: "Vegetarjansko"
                    }).expect(404);
                })
            })

            describe("given everything is okay", () => {
                it("should return a 200", async () => {
                    const response = await supertest(app).put(`/tags/${createdID}`).set('Cookie', cookie).send({
                        name: "Vegetarjansko"
                    }).expect(201);

                    expectedKeys.forEach(key => {
                        expect(response.body).toHaveProperty(key);
                    });
            
                    expect(response.body.name).toBe("Vegetarjansko");
                })
            })
        })
    })

    describe("└>GET", () => {
        describe("get tags", () => {
            it("should return a 200", async () => {
                await supertest(app).get(`/tags`)
                .expect(200)
                .expect('Content-Type', /json/)
                .expect((res) => {
                    if (!Array.isArray(res.body)) {
                        throw new Error("Response body is not an array");
                    }
    
                    res.body.forEach(tag => {
                        expectedKeys.forEach(key => {
                            if (!(key in tag)) {
                                throw new Error(`Missing key ${key} in user object`);
                            }
                        });
                    });
                })
            })
        })

        describe("get tag", () => {
            describe("given the tag doesn't exist", () => {
                it("should return a 404", async () => {
                    const nonExistentTagId = new mongoose.Types.ObjectId().toString();
    
                    await supertest(app).get(`/tags/${nonExistentTagId}`).expect(404)
                })
            })
            describe("given everything is okay", () => {
                it("should return a 200", async () => {
                    await supertest(app).get(`/tags/${createdID}`).expect(200)
                })
            })
        })
    })

    describe("└>DELETE", () => {
        describe("delete tag", () => {
            describe("given user isn't a admin", () => {
                it("should return a 401", async () => {
                    const userLoginResponse = await supertest(app).post(`/users/login`).send({
                        username: "username",
                        password: "password",
                    }).expect(200);

                    cookie = userLoginResponse.headers['set-cookie'];

                    await supertest(app).delete(`/tags/${createdID}`).set('Cookie', cookie)
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

                    await supertest(app).delete(`/tags/${createdID}`).set('Cookie', cookie)
                    .expect(204)
                                        
                    await supertest(app).get(`/tags/${createdID}`)
                    .expect(404);
                })
            })
        })
    })
})