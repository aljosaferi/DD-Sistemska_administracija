import supertest from "supertest";
import app from "../app";
const mongoose = require('mongoose');

const { resetDatabase, addAdminUser} = require('./jest.resetDatabase');

beforeAll(async () => {
  await resetDatabase();
})

const expectedKeys = [
    "username",
    "firstName",
    "lastName",
    "email",
    "userType",
    "pendingApproval",
    "_id",
    "id"
];


describe("users", () => {
    let createdID;
    let cookie;
    describe("└>POST", () => {
        describe("post user", () => {
            describe("given everything is okay - regular user", () => {
                it("should return a 201", async () => {
                    const response = await supertest(app).post(`/users`).send({
                        username: "username",
                        firstName: "firstName",
                        lastName: "lastName",
                        email: "firstName.lastName@gmail.com",
                        password: "password",
                        userType: "regular"
                    });

                    expect(response.statusCode).toBe(201);
            
                    expectedKeys.forEach(key => {
                        expect(response.body).toHaveProperty(key);
                    });
            
                    expect(response.body.username).toBe("username");
                    expect(response.body.firstName).toBe("firstName");
                    expect(response.body.lastName).toBe("lastName");
                    expect(response.body.email).toBe("firstName.lastName@gmail.com");
                    expect(response.body.userType).toBe("regular");
                    expect(response.body.pendingApproval).toBe(false);
            
                    expect(response.body._id).toMatch(/^[0-9a-fA-F]{24}$/);

                    createdID = response.body.id;
                })
            })

            describe("given everything is okay - restaurant owner", () => {
                it("should return a 201", async () => {
                    const response = await supertest(app).post(`/users`).send({
                        username: "username2",
                        firstName: "firstName2",
                        lastName: "lastName2",
                        email: "firstName2.lastName2@gmail.com",
                        password: "password2",
                        userType: "restaurantOwner"
                    });

                    expect(response.statusCode).toBe(201);
            
                    expectedKeys.forEach(key => {
                        expect(response.body).toHaveProperty(key);
                    });
            
                    expect(response.body.username).toBe("username2");
                    expect(response.body.firstName).toBe("firstName2");
                    expect(response.body.lastName).toBe("lastName2");
                    expect(response.body.email).toBe("firstName2.lastName2@gmail.com");
                    expect(response.body.userType).toBe("restaurantOwner");
                    expect(response.body.pendingApproval).toBe(true);
            
                    expect(response.body._id).toMatch(/^[0-9a-fA-F]{24}$/);
                })
            });

            describe("given the user has missing credentials", () => {
                it("should return a 500", async () => {
                    const response = await supertest(app).post(`/users`).send({
                        username: "missingCredentials",
                        lastName: "lastName",
                        email: "jan.valiser@gmail.com",
                        password: "password",
                        userType: "regular"
                    })

                    expect(response.statusCode).toBe(500)
                })
            });

            describe("given the user has an invalid type", () => {
                it("should return a 500", async () => {
                    const response = await supertest(app).post(`/users`).send({
                        username: "wrongType",
                        firstName: "firstName",
                        lastName: "lastName",
                        email: "jan.valiser@gmail.com",
                        password: "password",
                        userType: "something"
                    })

                    expect(response.statusCode).toBe(500)
                })
            });

            describe("given a user with this username already exists", () => {
                it("should return a 400", async () => {
                    const response = await supertest(app).post(`/users`).send({
                        username: "username",
                        firstName: "firstName",
                        lastName: "lastName",
                        email: "jan.valiser@gmail.com",
                        password: "password",
                        userType: "regular"
                    })

                    expect(response.statusCode).toBe(400)
                })
            });

        })

        describe("login", () => {
            describe("given invalid username", () => {
                it("should return a 401", async () => {
                    const response = await supertest(app).post(`/users/login`).send({
                        username: "nonExistant",
                        password: "password",
                    })

                    expect(response.statusCode).toBe(401)
                })
            });

            describe("given everything is okay", () => {
                it("should return a 200", async () => {
                    const response = await supertest(app).post(`/users/login`).send({
                        username: "username",
                        password: "password",
                    })

                    expect(response.statusCode).toBe(200);
                    cookie = response.headers['set-cookie'];

                    expectedKeys.forEach(key => {
                        expect(response.body).toHaveProperty(key);
                    });
            
                    expect(response.body.username).toBe("username");
                    expect(response.body.firstName).toBe("firstName");
                    expect(response.body.lastName).toBe("lastName");
                    expect(response.body.email).toBe("firstName.lastName@gmail.com");
                    expect(response.body.userType).toBe("regular");
                    expect(response.body.pendingApproval).toBe(false);
            
                    expect(response.body._id).toMatch(/^[0-9a-fA-F]{24}$/);
                })
            });
        })
    })

    describe("└>PUT", () => {
        describe("edit user", () => {
            describe("given user isn't logged in", () => {
                it("should return a 404", async () => {
                    const response = await supertest(app).put(`/users/${createdID}`).send({
                        username: "newUsername",
                        firstName: "newFirstName",
                        lastName: "newLastName",
                        email: "newFirstName.newLastName@gmail.com",
                        password: "newPassword"
                    });

                    expect(response.statusCode).toBe(404);
                })
            })

            describe("given everything is okay", () => {
                it("should return a 200", async () => {
                    const response = await supertest(app).put(`/users/${createdID}`).set('Cookie', cookie).send({
                        username: "newUsername",
                        firstName: "newFirstName",
                        lastName: "newLastName",
                        email: "newFirstName.newLastName@gmail.com",
                        password: "newPassword"
                    });

                    expect(response.statusCode).toBe(201);
            
                    expectedKeys.forEach(key => {
                        expect(response.body).toHaveProperty(key);
                    });
            
                    expect(response.body.username).toBe("newUsername");
                    expect(response.body.firstName).toBe("newFirstName");
                    expect(response.body.lastName).toBe("newLastName");
                    expect(response.body.email).toBe("newFirstName.newLastName@gmail.com");
                    expect(response.body.userType).toBe("regular");
                    expect(response.body.pendingApproval).toBe(false);
            
                    expect(response.body._id).toMatch(/^[0-9a-fA-F]{24}$/);
                })
            })
        })
    })

    describe("└>GET", () => {
        describe("get users", () => {
            it("should return a 200", async () => {
                await supertest(app).get(`/users`)
                .expect(200)
                .expect('Content-Type', /json/)
                .expect((res) => {
                    if (!Array.isArray(res.body)) {
                        throw new Error("Response body is not an array");
                    }
    
                    res.body.forEach(user => {
                        expectedKeys.forEach(key => {
                            if (!(key in user)) {
                                throw new Error(`Missing key ${key} in user object`);
                            }
                        });
                    });
                })
            })
        })

        describe("get user", () => {
            describe("given the user doesn't exist", () => {
                it("should return a 404", async () => {
                    const nonExistentUserId = new mongoose.Types.ObjectId().toString();
    
                    await supertest(app).get(`/users/${nonExistentUserId}`).expect(404)
                })
            })
            describe("given everything is okay", () => {
                it("should return a 200", async () => {
                    await supertest(app).get(`/users/${createdID}`).expect(200)
                })
            })
        })
    })

    describe("└>DELETE", () => {
        describe("delete user", () => {
            describe("given user isn't logged in", () => {
                it("should return a 404", async () => {
                    await supertest(app).delete(`/users/${createdID}`)
                    .expect(404)
                })
            })
            describe("given everything is okay", () => {
                it("should return a 204", async () => {
                    await supertest(app).delete(`/users/${createdID}`).set('Cookie', cookie)
                    .expect(204)
                                        
                    await supertest(app).get(`/users/${createdID}`)
                    .expect(404);
                })
            })
        })
    })
})