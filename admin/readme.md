# admin service

1. initial project `npm init -y`
2. install dependecies `npm install express cors`
3. install dev dependecies `npm install @types/express @types/cors @types/node nodemon typescript -D`
4. initial typescript `tsc --init` enable this below because we will ues type ORM

   ```
   "experimentalDecorators": true,
   "emitDecoratorMetadata": true,
   "moduleResolution": "node",
   ```

> can use `tsc -w` for watch changing in project

5. let's go to `package.json` then seting `"start": "nodemon src/app.js"` for watch javascript file
6. create folder `src` then create file `app.ts`
7. create database MySql `yt_node_admin`
8. install typeORM `npm install typeorm --save` and install reflect metadata `npm install reflect-metadata --save` then install `npm install @types/node --save-dev`
9. install typeORM for MySql `npm install mysql --save`
10. create folder `entity` and create file `product.ts` for implement typeorm
11. create file `ormconfig.json` inside root directory
12. create database name of database will same with `ormconfig.json`
13. use method `createConnection` inside file `app.ts`
