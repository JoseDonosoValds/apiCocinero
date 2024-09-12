
const express=require("express")
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./api/openApi.yaml')
require("dotenv").config();
const {dbConnection}=require('./database/dbconfig')
const app = express()
const cors = require("cors");
dbConnection()
app.use(cors())
app.use(express.json());
app.use(express.static("public"));
app.use("/api/restaurant", require("./routes/getRoute"))
/* Configurar Swagger UI para servir la documentación en la ruta /api-docs */
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))


// configuracion de swagger



app.listen(process.env.PORT,()=>{
    console.log(`Servidor en el puerto:  ${process.env.PORT}` )
    console.log('Documentación Swagger disponible en http://localhost:3000/docs')
})