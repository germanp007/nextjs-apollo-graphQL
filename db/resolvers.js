import Usuario from "../models/Usuario.js";

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
    nuevoUsuario: async (_, input) => {
      const { email, password } = input;

      // Revisar si el usuario esta registrado
      try {
        const existeUsuario = await Usuario.findOne({ email });
        if (existeUsuario) {
          throw new Error("Usuario ya existe");
        }
        // Hashear el password
        // Guardar en la base de Datos

        const usuario = new Usuario(input);
        usuario.save();
        return usuario;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
