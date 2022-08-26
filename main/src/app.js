"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const typeorm_1 = require("typeorm");
const callback_api_1 = __importDefault(require("amqplib/callback_api"));
const product_1 = require("./entity/product");
const axios_1 = __importDefault(require("axios"));
(0, typeorm_1.createConnection)().then((db) => {
    const productRepository = db.getMongoRepository(product_1.Product);
    callback_api_1.default.connect("amqps://jmcnzwfu:xu8o1WzZO03KO5H-NYJSObPyoubVmF2w@armadillo.rmq.cloudamqp.com/jmcnzwfu", (error0, conection) => {
        if (error0) {
            throw error0;
        }
        conection.createChannel((error1, channel) => {
            if (error1) {
                throw error1;
            }
            channel.assertQueue("product_created", { durable: true });
            channel.assertQueue("product_updated", { durable: true });
            channel.assertQueue("product_deleted", { durable: true });
            const app = (0, express_1.default)();
            app.use((0, cors_1.default)({
                origin: [
                    "http://localhost:3000",
                    "http://localhost:8080",
                    "http://localhost:4200",
                ],
            }));
            app.use(express_1.default.json());
            channel.consume("product_created", (msg) => __awaiter(void 0, void 0, void 0, function* () {
                const eventProduct = JSON.parse(msg.content.toString());
                const product = new product_1.Product();
                product.admin_id = parseInt(eventProduct.id);
                product.title = eventProduct.title;
                product.image = eventProduct.image;
                product.likes = eventProduct.likes;
                productRepository.save(product);
                console.log("product created");
            }), { noAck: true });
            channel.consume("product_updated", (msg) => __awaiter(void 0, void 0, void 0, function* () {
                const eventProduct = JSON.parse(msg.content.toString());
                const product = yield productRepository.findOneBy({
                    admin_id: parseInt(eventProduct.id),
                });
                productRepository.merge(product, {
                    title: eventProduct.title,
                    image: eventProduct.image,
                    likes: eventProduct.likes,
                });
                yield productRepository.save(product);
                console.log("product updated");
            }), { noAck: true });
            channel.consume("product_deleted", (msg) => __awaiter(void 0, void 0, void 0, function* () {
                const admin_id = parseInt(msg.content.toString());
                //   console.log(admin_id);
                yield productRepository.deleteOne({ admin_id });
                console.log("product deleted");
            }));
            app.get("/api/products", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
                const products = yield productRepository.find();
                return res.send(products);
            }));
            app.post("/api/products/:id/like", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
                const product = yield productRepository.findOneBy(req.params.id);
                yield axios_1.default.post(`http://localhost:8000/api/products/${product.admin_id}/like`, {});
                product.likes++;
                const result = yield productRepository.save(product);
                return res.send(result);
            }));
            app.listen(8001, () => {
                console.log("server main is running...");
            });
            process.on("beforeExit", () => {
                console.log("closing");
                conection.close();
            });
        });
    });
});
