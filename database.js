import mongoose from "mongoose";

const connectionString = "mongodb://localhost:27017/eaglemotors";

export const ConnectDatabase = () => {
  mongoose
    .connect(connectionString, {})
    .then(() => console.log("Database Connected"))
    .catch(() => console.log("Connection Failed"));
};
