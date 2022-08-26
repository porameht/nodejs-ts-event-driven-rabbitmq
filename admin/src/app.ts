import express, { Request, Response } from "express";
import cors from "cors";
import { createConnection } from "typeorm";
import { Product } from "./entity/product";
import amqp from "amqplib/callback_api";

createConnection().then((db) => {
  const productRepository = db.getRepository(Product);

  amqp.connect(
    "amqps://jmcnzwfu:xu8o1WzZO03KO5H-NYJSObPyoubVmF2w@armadillo.rmq.cloudamqp.com/jmcnzwfu",
    (error0, conection) => {
      if (error0) {
        throw error0;
      }

      conection.createChannel((error1, channel) => {
        if (error1) {
          throw error1;
        }

        const app = express();

        app.use(
          cors({
            origin: [
              "http://localhost:3000",
              "http://localhost:8080",
              "http://localhost:4200",
            ],
          })
        );

        app.use(express.json());

        app.get("/api/products", async (req: Request, res: Response) => {
          const products = await productRepository.find();
          return res.send(products);
        });

        app.post("/api/products", async (req: Request, res: Response) => {
          const product = await productRepository.create(req.body);
          const result = await productRepository.save(product);

          // rabbitmq
          channel.sendToQueue(
            "product_created",
            Buffer.from(JSON.stringify(result))
          );

          return res.send(result);
        });

        app.get("/api/products/:id", async (req: Request, res: Response) => {
          const product = await productRepository.findOne({
            where: { id: parseInt(req.params.id) },
          });
          return res.send(product);
        });

        app.put("/api/products/:id", async (req: Request, res: Response) => {
          const product: any = await productRepository.findOneBy({
            id: parseInt(req.params.id),
          });
          productRepository.merge(product, req.body);
          const result = await productRepository.save(product);

          // rabbitmq
          channel.sendToQueue(
            "product_updated",
            Buffer.from(JSON.stringify(result))
          );
          return res.send(result);
        });

        app.delete("/api/products/:id", async (req: Request, res: Response) => {
          const result = await productRepository.delete(req.params.id);
          // rabbitmq
          channel.sendToQueue("product_deleted", Buffer.from(req.params.id));

          return res.send(result + " delete already");
        });

        app.post(
          "/api/products/:id/like",
          async (req: Request, res: Response) => {
            const product: any = await productRepository.findOneBy({
              id: parseInt(req.params.id),
            });

            product.likes++;
            const result = await productRepository.save(product);
            return res.send(result);
          }
        );

        app.listen(8000, () => {
          console.log("server admin is running...");
        });
        process.on("beforeExit", () => {
          console.log("closing");
          conection.close();
        });
      });
    }
  );
});
