import Usuario from "../models/Usuario.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ path: "variables.env" });
// RESOLVERS

const crearToken = (usuario, secret, expiresIn) => {
  const { id, email, nombre, apellido } = usuario;
  return jwt.sign({ id }, secret, { expiresIn });
};
export const resolvers = {
  //   Query: {
  //     obtenerCursos: (_, { input }, ctx) => {
  //       const resultado = cursos.filter(
  //         (curso) => curso.tecnologia === input.tecnologia
  //       );
  //       return resultado;
  //     },
  //     obtenerTecnologia: () => cursos,
  //   },
  Query: {
    obtenerCursos: () => "algo",
  },
  Mutation: {
    nuevoUsuario: async (_, { input }) => {
      const { email, password } = input;

      // Revisar si el usuario esta registrado

      const existeUsuario = await Usuario.findOne({ email });

      if (existeUsuario) {
        throw new Error("Usuario ya existe");
      }
      // Hashear el password

      const salt = await bcryptjs.genSalt(10);
      input.password = await bcryptjs.hash(password, salt); // agregar el hash al obj input

      // Guardar en la base de Datos
      try {
        const usuario = new Usuario(input);
        const respuesta = await usuario.save();
        return respuesta;
      } catch (error) {
        console.log(error);
      }
    },
    autenticarUsuario: async (_, { input }) => {
      const { email, password } = input;

      const usuarioExiste = await Usuario.findOne({ email });
      // revisar si existe el usuario
      try {
        if (!usuarioExiste) {
          throw new Error("El usuario no existe");
        }

        //revisar si el password es correcto
        const passwordCorrecto = await bcryptjs.compare(
          password,
          usuarioExiste.password
        );
        if (!passwordCorrecto) {
          throw new Error("Password incorrecto");
        }
        //crear el token
        return {
          token: crearToken(usuarioExiste, process.env.SECRET_WORD, "24h"),
        };
      } catch (error) {
        console.log(error);
      }
    },
  },
};
