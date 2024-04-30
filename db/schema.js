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
PD: En MOngo entero o float en Number, en GraphQL  se llaman a Int y Float.
Cuando el dato tiene un ! ej: String! es obligatorio o required
*/

export const typeDefs = gql`
  type Token {
    token: String
  }

  type Usuario {
    id: ID
    nombre: String
    apellido: String
    email: String
    creado: String
  }
  type Producto {
    id: ID
    nombre: String
    existencia: Int
    precio: Float
    creado: String
  }
  input AutenticarInput {
    email: String!
    password: String!
  }
  input UsuarioInput {
    nombre: String!
    apellido: String!
    email: String!
    password: String!
  }

  input ProductoInput {
    nombre: String!
    existencia: Int!
    precio: Float!
  }

  type Query {
    # Usuarios
    obtenerUsuario(token: String!): Usuario
    # Productos
    obtenerProductos: [Producto]
    obtenerProducto(id: ID!): Producto
  }
  type Mutation {
    # Usuarios
    nuevoUsuario(input: UsuarioInput): Usuario
    autenticarUsuario(input: AutenticarInput): Token

    # Productos
    nuevoProducto(input: ProductoInput): Producto
    actualizarProducto(id: ID!, input: ProductoInput): Producto
    eliminarProducto(id: ID!): String
  }
`;
