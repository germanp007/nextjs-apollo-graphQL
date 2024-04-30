import { ApolloServer } from "apollo-server";
import { resolvers } from "./db/resolvers.js";
import { typeDefs } from "./db/schema.js";
import { conectDB } from "./config/db.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ path: "variables.env" });
//Conectando a la DB
conectDB();
//  Servidor

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers["authorization"] || "";
    if (token) {
      try {
        const usuario = jwt.verify(token, process.env.SECRET_WORD);

        return {
          usuario,
        };
      } catch (error) {
        console.log(error);
        console.log("Hubo un error");
      }
    }
  },
});

// Levantar el servidor

server.listen().then(({ url }) => {
  console.log(`Servidor listo en la url: ${url}`);
});
