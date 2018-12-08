const express = require('express');
const app = express();         
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const sql = require('mssql');
const connStr = "Server=tcp:projeto321.database.windows.net,1433;database=dbprojeto;User ID=projeto321;Password=Faculdadebandtec2018;encrypt=true;trustServerCertificate=true;hostNameInCertificate=projeto321.database.windows.net;loginTimeout=30";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const router = express.Router();
router.get('/', (req, res) => res.json({ message: 'Working' }));
app.use('/', router);

app.listen(port);
	
