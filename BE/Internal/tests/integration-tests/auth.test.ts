import request from "supertest";
import { Server } from "../../src/app";
import Loader from "../../src/Loaders";
import Tables, { Employee } from "../../src/Models";
import bcrypt from "bcrypt";
import { adminUser } from "../setup/mockDatas/mockUser";


describe("Authentication API", () => {
    let app: any;
    beforeAll(async () => {
        // Set up a test database connection
        const server: Server = new Server();
        await server.initial();
        const tables = new Tables();
        const loader = new Loader();
        await loader.load();
        await tables.createTables();
        await Loader.sequelize.sync({ force: true });
        app = server.getApp();
        adminUser.hashedPassword = await bcrypt.hash("manager", 10);
        const user = await Employee.create(adminUser);
    });

    afterAll(async () => {
        // Close the database connection after all tests
        await Loader.sequelize.sync({ force: true });
        await Loader.sequelize.close();
    });

    it("should return a JWT token with valid credentials", async () => {
        const response = await request(app)
            .post("/api/users/admin/signin")
            .send({ username: "manager", password: "manager" });

        expect(response.status).toBe(200);

        expect(response.body).toHaveProperty("accessToken");
    });

    it("should resspone status 404 if user not exist", async () => {
        const response = await request(app)
            .post("/api/users/admin/signin")
            .send({ username: "manager1", password: "manager" });

        expect(response.status).toBe(404);

        expect(response.body).toHaveProperty("message");
        expect(response.body["message"]).toBe("User not exist");
    });

    it("should resspone status 400 if wrong password", async () => {
        const response = await request(app)
            .post("/api/users/admin/signin")
            .send({ username: "manager", password: "manager2" });

        expect(response.status).toBe(400);
    });


    it("should resspone bad request if mising username ", async () => {
        const response = await request(app)
            .post("/api/users/admin/signin")
            .send({ password: "manager" });

        expect(response.status).toBe(400);
    });

    it("should resspone bad request if mising password", async () => {
        const response = await request(app)
            .post("/api/users/admin/signin")
            .send({ password: "manager" });

        expect(response.status).toBe(400);
    });
});
