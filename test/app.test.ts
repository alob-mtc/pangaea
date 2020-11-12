import request from "supertest";
import app from "../src/app";

describe("GET /random-url", () => {
    it("should return 404", (done) => {
        request(app).get("/")
            .expect(404, done);
    });
});
