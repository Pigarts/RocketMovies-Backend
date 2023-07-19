require("express-async-errors")
require("dotenv/config")
const database = require("./database/sqlite")
const AppError = require("./Utils/AppError")
const express = require("express")
const routes = require("./Routes")
const uploadConfig = require("../src/configs/upload")
const cors = require("cors");


const app = express()
app.use(cors())
app.use(express.json())
app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER))

app.use(routes)

database();

app.use((error,request, response, next) => {
    if(error instanceof AppError) {
        return response.status(error.statusCode).json({
            status: "error",
            message: error.message
        });
    }

    console.error(error)

        return response.status(500).json({
            status: "error",
            message: "internal server error"
        })
    
});

const port = process.env.PORT || 3333
app.listen(port, () => console.log(`server em ${port}`));
