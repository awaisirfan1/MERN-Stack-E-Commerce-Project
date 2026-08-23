import mongoose from "mongoose";

const connetDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "Ecommerce2026",
        });
        console.log("MongoDB connected");
    } catch (error) {
        console.log(error);
    }
};

export default connetDb;