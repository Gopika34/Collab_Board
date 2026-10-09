import {
    describe,
    it,
    expect,
    beforeAll,
    afterAll,
    beforeEach
} from "vitest";

import request from "supertest";
import mongoose from "mongoose";

import app from "../app.js";

import {
    setupTestDatabase,
    clearTestDatabase,
    closeTestDatabase
} from "./setup.js";

import { createUser } from "./helpers.js";

import { listModel } from "../models/List.js";
import { cardModel } from "../models/Card.js";

beforeAll(async () => {
    process.env.NODE_ENV = "test";
    process.env.JWT_SECRET = "test_secret";

    await setupTestDatabase();
});

beforeEach(async () => {
    await clearTestDatabase();
});

afterAll(async () => {
    await closeTestDatabase();
});

describe("Authentication API", () => {

    it("should register a new user", async () => {
        const response = await request(app)
            .post("/api/auth/signup")
            .send({
                userName: "Test User",
                email: "test@example.com",
                password: "password123"
            });

        expect(response.status).toBe(200);

        expect(response.body).toEqual({
            message: "User successfully registered!"
        });
    });


    it("should reject signup when username is missing", async () => {
        const response = await request(app)
            .post("/api/auth/signup")
            .send({
                email: "test@example.com",
                password: "password123"
            });

        expect(response.status).toBe(400);
    });


    it("should reject signup when email is missing", async () => {
        const response = await request(app)
            .post("/api/auth/signup")
            .send({
                userName: "Test User",
                password: "password123"
            });

        expect(response.status).toBe(400);
    });


    it("should reject signup when password is missing", async () => {
        const response = await request(app)
            .post("/api/auth/signup")
            .send({
                userName: "Test User",
                email: "test@example.com"
            });

        expect(response.status).toBe(400);
    });


    it("should reject duplicate email", async () => {
        await request(app)
            .post("/api/auth/signup")
            .send({
                userName: "First User",
                email: "duplicate@example.com",
                password: "password123"
            });

        const response = await request(app)
            .post("/api/auth/signup")
            .send({
                userName: "Second User",
                email: "duplicate@example.com",
                password: "password456"
            });

        expect(response.status).toBe(409);
    });


    it("should login with valid credentials", async () => {
        await request(app)
            .post("/api/auth/signup")
            .send({
                userName: "Login User",
                email: "login@example.com",
                password: "password123"
            });

        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email: "login@example.com",
                password: "password123"
            });

        expect(response.status).toBe(200);
        expect(response.body.token).toBeDefined();
    });


    it("should reject login with wrong password", async () => {
        await request(app)
            .post("/api/auth/signup")
            .send({
                userName: "Wrong Password",
                email: "wrong@example.com",
                password: "password123"
            });

        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email: "wrong@example.com",
                password: "wrongpassword"
            });

        expect(response.status).toBe(401);
    });


    it("should reject login with unknown email", async () => {
        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email: "doesnotexist@example.com",
                password: "password123"
            });

        expect(response.status).toBe(401);
    });


    it("should reject protected route without JWT", async () => {
        const response = await request(app)
            .get("/api/boards");

        expect(response.status).toBe(401);
    });


    it("should reject protected route with invalid JWT", async () => {
        const response = await request(app)
            .get("/api/boards")
            .set("Authorization", "Bearer invalid_token");

        expect(response.status).toBe(403);
    });

});


describe("Board API", () => {

    it("should create a board for authenticated user", async () => {
        const user = await createUser();

        const response = await request(app)
            .post("/api/boards")
            .set("Authorization", `Bearer ${user.token}`)
            .send({
                title: "My Project"
            });

        expect(response.status).toBe(201);

        expect(response.body.title).toBe("My Project");
        expect(response.body.owner).toBeDefined();
        expect(response.body.members).toContain(response.body.owner);
    });


    it("should reject board creation without JWT", async () => {
        const response = await request(app)
            .post("/api/boards")
            .send({
                title: "Unauthorized Board"
            });

        expect(response.status).toBe(401);
    });


    it("should fetch boards belonging to the authenticated user", async () => {
        const user = await createUser();

        await request(app)
            .post("/api/boards")
            .set("Authorization", `Bearer ${user.token}`)
            .send({
                title: "Board One"
            });

        await request(app)
            .post("/api/boards")
            .set("Authorization", `Bearer ${user.token}`)
            .send({
                title: "Board Two"
            });

        const response = await request(app)
            .get("/api/boards")
            .set("Authorization", `Bearer ${user.token}`);

        expect(response.status).toBe(200);

        expect(response.body).toHaveLength(2);

        const titles = response.body.map(board => board.title);

        expect(titles).toContain("Board One");
        expect(titles).toContain("Board Two");
    });


    it("should get a single board", async () => {
        const user = await createUser();

        const createResponse = await request(app)
            .post("/api/boards")
            .set("Authorization", `Bearer ${user.token}`)
            .send({
                title: "Single Board"
            });

        const boardId = createResponse.body._id;

        const response = await request(app)
            .get(`/api/boards/${boardId}`)
            .set("Authorization", `Bearer ${user.token}`);

        expect(response.status).toBe(200);
        expect(response.body._id).toBe(boardId);
        expect(response.body.title).toBe("Single Board");
    });


    it("should create default Todo, Doing and Done lists", async () => {
        const user = await createUser();

        const createResponse = await request(app)
            .post("/api/boards")
            .set("Authorization", `Bearer ${user.token}`)
            .send({
                title: "Kanban Board"
            });

        const boardId = createResponse.body._id;

        const response = await request(app)
            .get(`/api/lists/${boardId}`)
            .set("Authorization", `Bearer ${user.token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(3);

        const titles = response.body.map(list => list.title);

        expect(titles).toContain("Todo");
        expect(titles).toContain("Doing");
        expect(titles).toContain("Done");
    });


    it("should update a board title", async () => {
        const user = await createUser();

        const createResponse = await request(app)
            .post("/api/boards")
            .set("Authorization", `Bearer ${user.token}`)
            .send({
                title: "Old Title"
            });

        const boardId = createResponse.body._id;

        const response = await request(app)
            .patch(`/api/boards/${boardId}`)
            .set("Authorization", `Bearer ${user.token}`)
            .send({
                title: "Updated Title"
            });

        expect(response.status).toBe(200);
        expect(response.body.title).toBe("Updated Title");
    });


    it("should delete a board", async () => {
        const user = await createUser();

        const createResponse = await request(app)
            .post("/api/boards")
            .set("Authorization", `Bearer ${user.token}`)
            .send({
                title: "Board To Delete"
            });

        const boardId = createResponse.body._id;

        const deleteResponse = await request(app)
            .delete(`/api/boards/${boardId}`)
            .set("Authorization", `Bearer ${user.token}`);

        expect(deleteResponse.status).toBe(200);

        const getResponse = await request(app)
            .get(`/api/boards/${boardId}`)
            .set("Authorization", `Bearer ${user.token}`);

        expect(getResponse.status).toBe(404);
    });


    it("should prevent another user from accessing the board", async () => {
        const owner = await createUser({
            userName: "Owner",
            email: "owner@example.com"
        });

        const otherUser = await createUser({
            userName: "Other User",
            email: "other@example.com"
        });

        const createResponse = await request(app)
            .post("/api/boards")
            .set("Authorization", `Bearer ${owner.token}`)
            .send({
                title: "Private Board"
            });

        const boardId = createResponse.body._id;

        const response = await request(app)
            .get(`/api/boards/${boardId}`)
            .set("Authorization", `Bearer ${otherUser.token}`);

        expect(response.status).toBe(404);
    });


    it("should prevent another user from updating the board", async () => {
        const owner = await createUser({
            userName: "Owner",
            email: "owner@example.com"
        });

        const otherUser = await createUser({
            userName: "Other User",
            email: "other@example.com"
        });

        const createResponse = await request(app)
            .post("/api/boards")
            .set("Authorization", `Bearer ${owner.token}`)
            .send({
                title: "Owner Board"
            });

        const boardId = createResponse.body._id;

        const response = await request(app)
            .patch(`/api/boards/${boardId}`)
            .set("Authorization", `Bearer ${otherUser.token}`)
            .send({
                title: "Hacked Board"
            });

        expect(response.status).toBe(403);
    });


    it("should prevent another user from deleting the board", async () => {
        const owner = await createUser({
            userName: "Owner",
            email: "owner@example.com"
        });

        const otherUser = await createUser({
            userName: "Other User",
            email: "other@example.com"
        });

        const createResponse = await request(app)
            .post("/api/boards")
            .set("Authorization", `Bearer ${owner.token}`)
            .send({
                title: "Protected Board"
            });

        const boardId = createResponse.body._id;

        const response = await request(app)
            .delete(`/api/boards/${boardId}`)
            .set("Authorization", `Bearer ${otherUser.token}`);

        expect(response.status).toBe(403);
    });

});

describe("Card API", () => {

    const createBoardAndLists = async token => {
        const boardResponse = await request(app)
            .post("/api/boards")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Card Test Board"
            });

        const board = boardResponse.body;

        const listsResponse = await request(app)
            .get(`/api/lists/${board._id}`)
            .set("Authorization", `Bearer ${token}`);

        return {
            board,
            lists: listsResponse.body
        };
    };


    it("should create a card", async () => {
        const user = await createUser();

        const { lists } = await createBoardAndLists(user.token);

        const todoList = lists.find(
            list => list.title === "Todo"
        );

        const response = await request(app)
            .post("/api/cards")
            .set("Authorization", `Bearer ${user.token}`)
            .send({
                title: "Build login",
                description: "Implement JWT authentication",
                listId: todoList._id,
                order: 0
            });

        expect(response.status).toBe(201);

        expect(response.body.title).toBe("Build login");
        expect(response.body.description)
            .toBe("Implement JWT authentication");

        expect(response.body.listId)
            .toBe(todoList._id);
    });


    it("should fetch cards for a list", async () => {
        const user = await createUser();

        const { lists } = await createBoardAndLists(user.token);

        const todoList = lists.find(
            list => list.title === "Todo"
        );

        await request(app)
            .post("/api/cards")
            .set("Authorization", `Bearer ${user.token}`)
            .send({
                title: "Card One",
                description: "First card",
                listId: todoList._id,
                order: 0
            });

        const response = await request(app)
            .get(`/api/cards/${todoList._id}`)
            .set("Authorization", `Bearer ${user.token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].title).toBe("Card One");
    });


    it("should update a card", async () => {
        const user = await createUser();

        const { lists } = await createBoardAndLists(user.token);

        const todoList = lists.find(
            list => list.title === "Todo"
        );

        const createResponse = await request(app)
            .post("/api/cards")
            .set("Authorization", `Bearer ${user.token}`)
            .send({
                title: "Old Card",
                description: "Old description",
                listId: todoList._id,
                order: 0
            });

        const cardId = createResponse.body._id;

        const response = await request(app)
            .patch(`/api/cards/${cardId}`)
            .set("Authorization", `Bearer ${user.token}`)
            .send({
                title: "Updated Card",
                description: "Updated description"
            });

        expect(response.status).toBe(200);
        expect(response.body.title).toBe("Updated Card");
        expect(response.body.description)
            .toBe("Updated description");
    });


    it("should move a card between lists", async () => {
        const user = await createUser();

        const { lists } = await createBoardAndLists(user.token);

        const todoList = lists.find(
            list => list.title === "Todo"
        );

        const doingList = lists.find(
            list => list.title === "Doing"
        );

        const createResponse = await request(app)
            .post("/api/cards")
            .set("Authorization", `Bearer ${user.token}`)
            .send({
                title: "Move Me",
                description: "Drag me",
                listId: todoList._id,
                order: 0
            });

        const cardId = createResponse.body._id;

        const response = await request(app)
            .patch(`/api/cards/${cardId}`)
            .set("Authorization", `Bearer ${user.token}`)
            .send({
                listId: doingList._id,
                order: 0
            });

        expect(response.status).toBe(200);

        expect(response.body.listId)
            .toBe(doingList._id);

        expect(response.body.order)
            .toBe(0);

        const doingCards = await request(app)
            .get(`/api/cards/${doingList._id}`)
            .set("Authorization", `Bearer ${user.token}`);

        expect(doingCards.status).toBe(200);
        expect(doingCards.body).toHaveLength(1);
        expect(doingCards.body[0]._id).toBe(cardId);
    });


    it("should persist a moved card after fetching again", async () => {
        const user = await createUser();

        const { lists } = await createBoardAndLists(user.token);

        const todoList = lists.find(
            list => list.title === "Todo"
        );

        const doingList = lists.find(
            list => list.title === "Doing"
        );

        const createResponse = await request(app)
            .post("/api/cards")
            .set("Authorization", `Bearer ${user.token}`)
            .send({
                title: "Persistent Card",
                description: "",
                listId: todoList._id,
                order: 0
            });

        const cardId = createResponse.body._id;

        await request(app)
            .patch(`/api/cards/${cardId}`)
            .set("Authorization", `Bearer ${user.token}`)
            .send({
                listId: doingList._id,
                order: 0
            });

        const response = await request(app)
            .get(`/api/cards/${doingList._id}`)
            .set("Authorization", `Bearer ${user.token}`);

        expect(response.body).toHaveLength(1);

        expect(response.body[0]._id)
            .toBe(cardId);

        expect(response.body[0].listId)
            .toBe(doingList._id);
    });


    it("should delete a card", async () => {
        const user = await createUser();

        const { lists } = await createBoardAndLists(user.token);

        const todoList = lists.find(
            list => list.title === "Todo"
        );

        const createResponse = await request(app)
            .post("/api/cards")
            .set("Authorization", `Bearer ${user.token}`)
            .send({
                title: "Delete Me",
                description: "",
                listId: todoList._id,
                order: 0
            });

        const cardId = createResponse.body._id;

        const deleteResponse = await request(app)
            .delete(`/api/cards/${cardId}`)
            .set("Authorization", `Bearer ${user.token}`);

        expect(deleteResponse.status).toBe(200);

        const cardsResponse = await request(app)
            .get(`/api/cards/${todoList._id}`)
            .set("Authorization", `Bearer ${user.token}`);

        expect(cardsResponse.body).toHaveLength(0);
    });


    it("should prevent another user from accessing cards", async () => {
        const owner = await createUser({
            userName: "Card Owner",
            email: "cardowner@example.com"
        });

        const otherUser = await createUser({
            userName: "Card Stranger",
            email: "cardstranger@example.com"
        });

        const { lists } = await createBoardAndLists(owner.token);

        const todoList = lists.find(
            list => list.title === "Todo"
        );

        const response = await request(app)
            .get(`/api/cards/${todoList._id}`)
            .set("Authorization", `Bearer ${otherUser.token}`);

        expect(response.status).toBe(403);
    });


    it("should prevent another user from creating a card in the board", async () => {
        const owner = await createUser({
            userName: "Card Owner",
            email: "cardowner2@example.com"
        });

        const otherUser = await createUser({
            userName: "Card Stranger",
            email: "cardstranger2@example.com"
        });

        const { lists } = await createBoardAndLists(owner.token);

        const todoList = lists.find(
            list => list.title === "Todo"
        );

        const response = await request(app)
            .post("/api/cards")
            .set("Authorization", `Bearer ${otherUser.token}`)
            .send({
                title: "Unauthorized Card",
                description: "",
                listId: todoList._id,
                order: 0
            });

        expect(response.status).toBe(403);
    });


    it("should prevent another user from updating a card", async () => {
        const owner = await createUser({
            userName: "Card Owner",
            email: "cardowner3@example.com"
        });

        const otherUser = await createUser({
            userName: "Card Stranger",
            email: "cardstranger3@example.com"
        });

        const { lists } = await createBoardAndLists(owner.token);

        const todoList = lists.find(
            list => list.title === "Todo"
        );

        const createResponse = await request(app)
            .post("/api/cards")
            .set("Authorization", `Bearer ${owner.token}`)
            .send({
                title: "Protected Card",
                description: "",
                listId: todoList._id,
                order: 0
            });

        const cardId = createResponse.body._id;

        const response = await request(app)
            .patch(`/api/cards/${cardId}`)
            .set("Authorization", `Bearer ${otherUser.token}`)
            .send({
                title: "Hacked Card"
            });

        expect(response.status).toBe(403);
    });


    it("should prevent another user from deleting a card", async () => {
        const owner = await createUser({
            userName: "Card Owner",
            email: "cardowner4@example.com"
        });

        const otherUser = await createUser({
            userName: "Card Stranger",
            email: "cardstranger4@example.com"
        });

        const { lists } = await createBoardAndLists(owner.token);

        const todoList = lists.find(
            list => list.title === "Todo"
        );

        const createResponse = await request(app)
            .post("/api/cards")
            .set("Authorization", `Bearer ${owner.token}`)
            .send({
                title: "Protected Card",
                description: "",
                listId: todoList._id,
                order: 0
            });

        const cardId = createResponse.body._id;

        const response = await request(app)
            .delete(`/api/cards/${cardId}`)
            .set("Authorization", `Bearer ${otherUser.token}`);

        expect(response.status).toBe(403);
    });

});

describe("Cascade deletion", () => {

    it("should delete lists and cards when a board is deleted", async () => {
        const user = await createUser();

        const boardResponse = await request(app)
            .post("/api/boards")
            .set("Authorization", `Bearer ${user.token}`)
            .send({
                title: "Cascade Test"
            });

        const boardId = boardResponse.body._id;

        const listsResponse = await request(app)
            .get(`/api/lists/${boardId}`)
            .set("Authorization", `Bearer ${user.token}`);

        const todoList = listsResponse.body.find(
            list => list.title === "Todo"
        );

        await request(app)
            .post("/api/cards")
            .set("Authorization", `Bearer ${user.token}`)
            .send({
                title: "Cascade Card",
                description: "",
                listId: todoList._id,
                order: 0
            });

        const cardsBeforeDelete = await cardModel.find({
            listId: todoList._id
        });

        expect(cardsBeforeDelete).toHaveLength(1);

        await request(app)
            .delete(`/api/boards/${boardId}`)
            .set("Authorization", `Bearer ${user.token}`);

        const listsAfterDelete = await listModel.find({
            boardId
        });

        const cardsAfterDelete = await cardModel.find({
            listId: todoList._id
        });

        expect(listsAfterDelete).toHaveLength(0);
        expect(cardsAfterDelete).toHaveLength(0);
    });

});