import mongoose from "mongoose";

const ProductosSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  existencia: {
    type: Number,
    required: true,
    trim: true,
  },
  precio: {
    type: Number,
    required: true,
    trim: true,
  },
  creado: {
    type: Date,
    default: Date.now(),
  },
});

const Producto = mongoose.model("Producto", ProductosSchema);

export default Producto;
