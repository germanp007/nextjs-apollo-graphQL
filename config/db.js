import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "variables.env" });

export const conectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB Conectada");
  } catch (error) {
    console.log("Hubo un error al conectar a la DB");
    process.exit(1);
  }
};
