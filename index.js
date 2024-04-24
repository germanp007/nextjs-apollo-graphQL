import { ApolloServer } from "apollo-server";
import { resolvers } from "./db/resolvers.js";
import { typeDefs } from "./db/schema.js";
import { conectDB } from "./config/db.js";


//Conectando a la DB
conectDB();
//  Servidor

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Levantar el servidor

server.listen().then(({ url }) => {
  console.log(`Servidor listo en la url: ${url}`);
});
