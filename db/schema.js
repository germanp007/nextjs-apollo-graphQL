import { gql } from "apollo-server";

// SCHEMA

/*
Tipos de Datos en GraphQL

Int = Numero entero
Float = Numero decimal
String = Cadena de texto
Boolean = Verdadero o Falso
ID = Identificador, unico
Tipo de dato Date no existe en GraphQL
tener en cuenta el Model De mongo para hacer los Types
Cuando el dato tiene un ! ej: String! es obligatorio o required
*/

export const typeDefs = gql`
  type Usuario {
    id: ID
    nombre: String
    apellido: String
    email: String
    creado: String
  }
  input UsuarioInput {
    nombre: String!
    apellido: String!
    email: String!
    password: String!
  }
  type Query {
    obtenerCursos: String
  }
  type Mutation {
    nuevoUsuario(input: UsuarioInput): String
  }
`;
