import request from "supertest";
import app from "../app.js";

export const createUser = async ({
    userName = "Test User",
    email = "test@example.com",
    password = "password123"
} = {}) => {
    const signupResponse = await request(app)
        .post("/api/auth/signup")
        .send({
            userName,
            email,
            password
        });

    if (signupResponse.status !== 200) {
        throw new Error(
            `Signup failed: ${JSON.stringify(signupResponse.body)}`
        );
    }

    const loginResponse = await request(app)
        .post("/api/auth/login")
        .send({
            email,
            password
        });

    if (loginResponse.status !== 200) {
        throw new Error(
            `Login failed: ${JSON.stringify(loginResponse.body)}`
        );
    }

    return {
        token: loginResponse.body.token,
        email,
        password,
        userName
    };
};