import express from "express";
import cors from "cors";
import { Any, createConnection } from "typeorm";
import amqp from "amqplib/callback_api";
import { Product } from "./entity/product";

createConnection().then((db) => {
  const productRepository = db.getMongoRepository(Product);
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

        channel.assertQueue("product_created", { durable: true });
        channel.assertQueue("product_updated", { durable: true });
        channel.assertQueue("product_deleted", { durable: true });

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

        channel.consume(
          "product_created",
          async (msg) => {
            const eventProduct: Product = JSON.parse(msg!.content.toString());
            const product = new Product();
            product.admin_id = parseInt(eventProduct.id);
            product.title = eventProduct.title;
            product.image = eventProduct.image;
            product.likes = eventProduct.likes;
            productRepository.save(product);
            console.log("product created");
          },
          { noAck: true }
        );

        channel.consume(
          "product_updated",
          async (msg) => {
            const eventProduct: Product = JSON.parse(msg!.content.toString());
            const product: any = await productRepository.findOneBy({
              admin_id: parseInt(eventProduct.id),
            });
            productRepository.merge(product, {
              title: eventProduct.title,
              image: eventProduct.image,
              likes: eventProduct.likes,
            });
            await productRepository.save(product);
            console.log("product updated");
          },
          { noAck: true }
        );

        channel.consume("product_deleted", async (msg) => {
          const admin_id = parseInt(msg!.content.toString());
          //   console.log(admin_id);
          await productRepository.deleteOne({ admin_id });
          console.log("product deleted");
        });

        app.listen(8001, () => {
          console.log("server main is running...");
        });

        process.on("beforeExit", () => {
          console.log("closing");
          conection.close();
        });
      });
    }
  );
});
