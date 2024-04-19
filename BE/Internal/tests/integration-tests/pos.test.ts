import request from "supertest";
import { Server } from "../../src/app";
import Loader from "../../src/Loaders";
import Tables, {
    Cart,
    Category,
    Client,
    Employee,
    Floor,
    Permission,
    Product,
    Table,
} from "../../src/Models";
import bcrypt from "bcrypt";
import { mock } from "node:test";
import { adminUser } from "../setup/mockDatas/mockUser";
import { mockFloors } from "../setup/mockDatas/mockFloor";
import { mockTables } from "../setup/mockDatas/mockTable";
import { mockCategories } from "../setup/mockDatas/mockCategory";
import { mockProducts } from "../setup/mockDatas/mockProduct";
import { tableCart } from "../setup/mockDatas/mockCart";
import { mockCartItem } from "../setup/mockDatas/mockCartItem";
import { mockPermissions } from "../setup/mockDatas/mockPermission";

describe("POS API", () => {
    let app: any;
    let token = "";
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
        await Floor.bulkCreate(mockFloors);
        await Table.bulkCreate(mockTables);
        await Category.bulkCreate(mockCategories);
        await Product.bulkCreate(mockProducts);
        await Cart.bulkCreate(tableCart);
        await Permission.bulkCreate(mockPermissions);
        adminUser.hashedPassword = await bcrypt.hash("manager", 10);
        const admin = await Employee.create(adminUser);
        const response = await request(app)
            .post("/api/users/admin/signin")
            .send({ username: "manager", password: "manager" });
        token = response.body.accessToken;
    });

    afterAll(async () => {
        // Close the database connection after all tests
        // await Loader.sequelize.close();
        await Loader.sequelize.sync({ force: true });
    });

    // ADD ONE ITEM TO CART
    it("should return items including 1 cart item ", async () => {
        const response = await request(app)
            .put("/api/tables/cart/1")
            .set("Authorization", `Bearer ${token}`)
            .send([mockCartItem[0]]);
        expect(response.status).toBe(200);

        expect(
            response.body.items.some(
                (item: any) => item.productId === mockCartItem[0].id
            )
        ).toBeTruthy();
    });

    // ADD THE SAME ITEM TO CART
    it("should return items including 1 cart item with quantity 2 ", async () => {
        const response = await request(app)
            .put("/api/tables/cart/1")
            .set("Authorization", `Bearer ${token}`)
            .send([mockCartItem[0]]);

        expect(response.status).toBe(200);
        expect(
            response.body.items.some((item: any) => item.quantity === 2)
        ).toBeTruthy();
    });

    // ADD NEW ITEM TO CART
    it("should return items including 2 cart items", async () => {
        const response = await request(app)
            .put("/api/tables/cart/1")
            .set("Authorization", `Bearer ${token}`)
            .send([mockCartItem[1]]);

        expect(response.status).toBe(200);
        expect(response.body.items.length === 2).toBeTruthy();
    });

    // GET CART ITEMS
    it("should return items including 2 cart items", async () => {
        const response = await request(app)
            .get("/api/tables/cart/1")
            .set("Authorization", `Bearer ${token}`)
            .send(mockCartItem);

        // FOR NEXT TEST
        await request(app)
            .put("/api/orders/chef")
            .set("Authorization", `Bearer ${token}`)
            .send({
                orderId: 1,
                productId: 1,
                dish_status: "Cooking",
                POS: true,
            });
        await request(app)
            .put("/api/orders/chef")
            .set("Authorization", `Bearer ${token}`)
            .send({
                orderId: 1,
                productId: 2,
                dish_status: "Cooking",
                POS: true,
            });
        await request(app)
            .put("/api/orders/chef")
            .set("Authorization", `Bearer ${token}`)
            .send({ orderId: 1, productId: 1, dish_status: "Done", POS: true });
        await request(app)
            .put("/api/orders/chef")
            .set("Authorization", `Bearer ${token}`)
            .send({ orderId: 1, productId: 2, dish_status: "Done", POS: true });

        expect(response.status).toBe(200);
        expect(response.body.items.length === 2).toBeTruthy();
    });

    // CASH PAYMENT
    it("should return success code", async () => {
        const response = await request(app)
            .post("/api/tables/order/1")
            .set("Authorization", `Bearer ${token}`)
            .send({
                payment_method: "CASH",
                phone: "0123456789",
                email: "test@gmail.com",
                firstname: "Nguyen",
                lastname: "A",
            });

        expect(response.status).toBe(200);
    });

    // MOMO PAYMENT
    it("should return success code", async () => {
        await request(app)
            .put("/api/tables/cart/1")
            .set("Authorization", `Bearer ${token}`)
            .send([mockCartItem[0]]);
        await request(app)
            .put("/api/orders/chef")
            .set("Authorization", `Bearer ${token}`)
            .send({
                orderId: 1,
                productId: 1,
                dish_status: "Cooking",
                POS: true,
            });

        const response = await request(app)
            .post("/api/tables/order/1")
            .set("Authorization", `Bearer ${token}`)
            .send({
                payment_method: "MOMO",
                phone: "0123456789",
                email: "test@gmail.com",
                firstname: "Nguyen",
                lastname: "A",
            });
        expect(response.status).toBe(200);
        expect(response.text).toMatch(/"payUrl":"([^"]*)"/);
        expect(response.status).toBe(200);
        const payUrlRegex = /"payUrl":"([^"]*)"/;
        const match = response.text.match(payUrlRegex);
        expect(match && match.length > 1).toBeTruthy();
        let payUrl = match ? match[1] : "";
        expect(
            payUrl.startsWith("https://test-payment.momo.vn/v2/gateway/pay?")
        ).toBeTruthy();
    });
});
