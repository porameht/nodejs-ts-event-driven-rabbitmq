# main service

1. initial project `npm init -y` for create `package.json` file
2. copy code inside file `admin/package.json` to `main/package.json` then remove dependecies `mysql`
3. using command `npm install` for install node_module
4. install mongodb for database `npm install mongodb`
5. create `tsconfig.json` and copy code inside from `admin/tsconfig.json`
6. create folder `src` and inside will create file `app.ts` then create folder `entity` in directory and create `prodcut.ts`

7. install rabbitmq `npm i amqplib` and `npm install -D @types/amqplib`
8. import amqplib inside file `app.ts` then copy url `amqps://<...>@armadillo.rmq.cloudamqp.com/` from `https://cloudamqp.com/`
9. using parameter channel `channel.assertQueue("hello", { durable: false });` and `channel.consume("hello", (msg) => { console.log(msg?.content.toString()); });`
