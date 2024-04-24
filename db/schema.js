import { gql } from "apollo-server";

// SCHEMA

export const typeDefs = gql`
  type Query {
    obtenerCursos: String
  }
`;
