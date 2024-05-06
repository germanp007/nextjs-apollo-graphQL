import Usuario from "../models/Usuario.js";
import Producto from "../models/Producto.js";
import Cliente from "../models/Clientes.js";
import Pedido from "../models/Pedidos.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ path: "variables.env" });
// RESOLVERS

const crearToken = (usuario, secret, expiresIn) => {
  const { id, email, nombre, apellido } = usuario;
  return jwt.sign({ id, email, nombre, apellido }, secret, { expiresIn });
};
export const resolvers = {
  Query: {
    obtenerUsuario: async (_, { token }) => {
      const usuarioId = await jwt.verify(token, process.env.SECRET_WORD);
      return usuarioId;
    },
    obtenerProductos: async () => {
      try {
        const productos = await Producto.find({});
        return productos;
      } catch (error) {
        console.log(error);
      }
    },
    obtenerProducto: async (_, { id }) => {
      const producto = await Producto.findById(id);
      if (!producto) {
        throw new Error("Producto no encontrado");
      }

      return producto;
    },
    obtenerClientes: async () => {
      try {
        const clientes = await Cliente.find({});
        return clientes;
      } catch (error) {
        console.log(error);
      }
    },
    obtenerClienteVendedor: async (_, {}, ctx) => {
      try {
        const clientes = await Cliente.find({
          vendedor: ctx.usuario.id.toString(),
        });
        return clientes;
      } catch (error) {
        console.log(error);
      }
    },
    obtenerCliente: async (_, { id }, ctx) => {
      //revisar si el cliente existe

      const cliente = await Cliente.findById(id);

      if (!cliente) {
        throw new Error("No se ha encontrado");
      }
      // Quien lo creo puede verlo
      if (cliente.vendedor.toString() !== ctx.usuario.id) {
        throw new Error("No tienes las credenciales");
      }

      return cliente;
    },
  },
  Mutation: {
    // Para crear Usuario agregar hash y guardar en la BD
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
    // Para autenticarlo con JWT y comparar el Hash
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

    // Productos
    nuevoProducto: async (_, { input }) => {
      try {
        const producto = new Producto(input);
        const nuevoProducto = await producto.save();
        return nuevoProducto;
      } catch (error) {
        console.log(error);
      }
    },
    actualizarProducto: async (_, { id, input }) => {
      // Revisar si el producto existe
      let product = await Producto.findOne({ _id: id });
      if (!product) {
        throw new Error("No se encontró el producto");
      }
      // Actualizar el producto en la BD
      product = await Producto.findOneAndUpdate({ _id: id }, input, {
        new: true,
      });
      return product;
    },
    eliminarProducto: async (_, { id }) => {
      let producto = await Producto.findById(id);

      if (!producto) {
        throw new Error("Producto no encontrado");
      }
      await Producto.findOneAndDelete({ _id: id });
      return "Producto Eliminado";
    },

    // Clientes
    nuevoCliente: async (_, { input }, ctx) => {
      //Verificar si el cliente ya esta registrado

      const { email } = input;
      const cliente = await Cliente.findOne({ email });
      if (cliente) {
        throw new Error("Usuario existente");
      }
      const nuevoCliente = new Cliente(input);
      //Asignar el vendedor
      nuevoCliente.vendedor = ctx.usuario.id;

      try {
        // Guardar en la base de datos
        const result = await nuevoCliente.save();
        return result;
      } catch (error) {
        console.log(error);
      }
    },
    actualizarCliente: async (_, { id, input }, ctx) => {
      // Verificar si existe o no
      let cliente = await Cliente.findById(id);
      if (!cliente) {
        throw new Error("Ese cliente no existe");
      }
      // Verificar si el vendedor es quien edita
      // console.log(ctx.usuario.id);
      console.log(cliente.vendedor.toString() === ctx.usuario.id);
      if (cliente.vendedor.toString() !== ctx.usuario.id) {
        throw new Error("No tienes las credenciales");
      }
      // Guardar actualizaciones
      cliente = await Cliente.findByIdAndUpdate({ _id: id }, input, {
        new: true,
      });
      return cliente;
    },
    eliminarCliente: async (_, { id }, ctx) => {
      const cliente = await Cliente.findById(id);

      if (cliente.vendedor.toString() !== ctx.usuario.id) {
        throw new Error("No tienes las credenciales para ejecutar esta accion");
      }
      return "Cliente Eliminado";
    },
    nuevoPedido: async (_, { input }, ctx) => {
      //Verificar si cliente existe
      const { cliente } = input;
      let clienteExiste = await Cliente.findById(cliente);
      if (!clienteExiste) {
        throw new Error("Cliente no existe");
      }
      // verificar si cliente es del vendedor

      if (clienteExiste.vendedor.toString() !== ctx.usuario.id) {
        throw new Error("No tienes las credenciales");
      }
      // Revisar q stock este disponible
      for await (const art of input.pedido) {
        const { id } = art;
        const producto = await Producto.findById(id);
        if (art.cantidad > producto.existencia) {
          throw new Error(
            `El articulo ${producto.nombre} excede la cantidad en Stock disponible`
          );
        } else {
          // Restar el estado disponible
          producto.existencia = producto.existencia - art.cantidad;
          await producto.save();
        }
      }
      // Crear un nuevo pedido
      const nuevoPedido = new Pedido(input);
      // Asignar un vendedor
      nuevoPedido.vendedor = ctx.usuario.id;
      // Guardar BD
      const result = nuevoPedido.save();
      return result;
    },
  },
};
