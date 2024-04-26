import Usuario from "../models/Usuario.js";
import bcryptjs from "bcryptjs";
// RESOLVERS

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
  },
};
