require('dotenv').config()
const epxress = require('express')
const cors = require('cors')
const app = epxress()
const { dbConnect } = require('./app/database/mongo')
const {swaggerDocs:V1SwaggerDocs} = require("./app/swagger");

const PORT = process.env.PORT || 3000
app.use(cors())
app.use(epxress.json())
app.use(epxress.static('public'));
app.use('/api/1.0', require('./app/routes'))
dbConnect();
app.listen(PORT, () => {
    console.log(`Tu API es http://localhost:${PORT}/api/1.0`);
    V1SwaggerDocs(app,PORT);
})