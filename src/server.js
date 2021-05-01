require("dotenv").config({ path: "../.env" });
require('./database');
const express = require('express');
const cors = require('cors');
const http = require('http');

const swaggerUi = require('swagger-ui-express'),
      swaggerDocument = require('./swagger.json');
const routes = require('./Routes/index');


const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);

var corsOptions = {
  origin: `${process.env.REACT_APP_ENDPOINT}`,
  credentials: true
};

app.use(express.json());
app.options('*', cors());
app.use(cors(corsOptions));

app.use(routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }));
app.use('/', (req, res) => {
  res.send("<div> Default Express Endpoint </div>");
});

server.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`);
});
