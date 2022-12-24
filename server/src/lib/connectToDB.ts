import { connect, ConnectOptions, disconnect } from "mongoose";

export const connectToDB = async () => {
  const MONGO_URI: string =
    process.env.MONGO_URI || "mongodb://localhost/stock-dashboard";
  try {
    await connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
};
