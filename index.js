const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./routes/auth");

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(authRouter);

const DB = "mongodb+srv://poc:poc@cluster1.47zqfjq.mongodb.net/POC?retryWrites=true&w=majority";

mongoose.connect(DB).then(() => {
    console.log("Connected to database");
}).catch((error) => {
    console.log(error);
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Connected at port ${PORT}`);
})