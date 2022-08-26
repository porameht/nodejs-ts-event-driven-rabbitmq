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
const product_1 = require("./entity/product");
const callback_api_1 = __importDefault(require("amqplib/callback_api"));
(0, typeorm_1.createConnection)().then((db) => {
    const productRepository = db.getRepository(product_1.Product);
    callback_api_1.default.connect("amqps://jmcnzwfu:xu8o1WzZO03KO5H-NYJSObPyoubVmF2w@armadillo.rmq.cloudamqp.com/jmcnzwfu", (error0, conection) => {
        if (error0) {
            throw error0;
        }
        conection.createChannel((error1, channel) => {
            if (error1) {
                throw error1;
            }
            const app = (0, express_1.default)();
            app.use((0, cors_1.default)({
                origin: [
                    "http://localhost:3000",
                    "http://localhost:8080",
                    "http://localhost:4200",
                ],
            }));
            app.use(express_1.default.json());
            app.get("/api/products", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
                const products = yield productRepository.find();
                return res.send(products);
            }));
            app.post("/api/products", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
                const product = yield productRepository.create(req.body);
                const result = yield productRepository.save(product);
                // rabbitmq
                channel.sendToQueue("product_created", Buffer.from(JSON.stringify(result)));
                return res.send(result);
            }));
            app.get("/api/products/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
                const product = yield productRepository.findOne({
                    where: { id: parseInt(req.params.id) },
                });
                return res.send(product);
            }));
            app.put("/api/products/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
                const product = yield productRepository.findOneBy({
                    id: parseInt(req.params.id),
                });
                productRepository.merge(product, req.body);
                const result = yield productRepository.save(product);
                // rabbitmq
                channel.sendToQueue("product_updated", Buffer.from(JSON.stringify(result)));
                return res.send(result);
            }));
            app.delete("/api/products/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield productRepository.delete(req.params.id);
                // rabbitmq
                channel.sendToQueue("product_deleted", Buffer.from(req.params.id));
                return res.send(result + " delete already");
            }));
            app.post("/api/products/:id/like", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
                const product = yield productRepository.findOneBy({
                    id: parseInt(req.params.id),
                });
                product.likes++;
                const result = yield productRepository.save(product);
                return res.send(result);
            }));
            app.listen(8000, () => {
                console.log("server admin is running...");
            });
            process.on("beforeExit", () => {
                console.log("closing");
                conection.close();
            });
        });
    });
});
