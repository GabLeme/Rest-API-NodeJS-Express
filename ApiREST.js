const express = require('express');
const app = express();         
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const sql = require('mssql');
const connStr = 'Server=tcp:projeto321.database.windows.net,1433;database=dbprojeto;User ID=projeto321;Password=Faculdadebandtec2018;encrypt=true;trustServerCertificate=true;hostNameInCertificate=projeto321.database.windows.net;loginTimeout=30';
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
//   next();
// });

sql.connect(connStr)
   .then(conn => GLOBAL.conn = conn)
   .catch(err => console.log(err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const router = express.Router();
router.get('/', (req, res) => res.json({ message: 'Working' }));
app.use('/', router);

app.listen(port);

console.log('foi' + port);
	
function execSQLQuery(sqlQry, res){
    GLOBAL.conn.request()
               .query(sqlQry)
               .then(result => res.json(result.recordset))
               .catch(err => res.json(err));
}

router.get('/usuario/login/:param1/:param2', (req, res) =>{
    var querySql = `SELECT * FROM TBL_USUARIO WHERE EMAIL = \'${req.params.param1}'
                    AND SENHA = \'${req.params.param2}'`
    execSQLQuery(querySql, res);
})

router.get('/usuario/maquina/:idUsuario?', (req, res) =>{
    let codUsuario = parseInt(req.params.idUsuario);
    var querySql = `SELECT * FROM TBL_MAQUINA WHERE COD_USUARIO = \'${codUsuario}'`
    execSQLQuery(querySql, res);
})

router.get('/usuario/maquina/leitura/:idMaquina?', (req, res) =>{
    let codMaquina = parseInt(req.params.idMaquina);
    var querySql = `SELECT TOP 1 * FROM TBL_LEITURA WHERE COD_MAQUINA = \'${codMaquina}' ORDER BY COD_LEITURA DESC`
    execSQLQuery(querySql, res);
})

router.get('/usuario/maquina/analytics/ram/:idMaquina?', (req, res) =>{
	let codMaquina = parseInt(req.params.idMaquina);
    execSQLQuery(`SELECT DISTINCT MIN(RAM_PERCENTUAL) OVER(PARTITION BY 1) AS valMin, 
    MAX(RAM_PERCENTUAL) OVER(PARTITION BY 1) AS valMax,
    PERCENTILE_CONT(0.5) WITHIN GROUP(ORDER BY RAM_PERCENTUAL) OVER(PARTITION BY 1) AS valMediana,
    AVG(CAST(RAM_PERCENTUAL AS INTEGER)) OVER(PARTITION BY 1) AS valMedia,
    PERCENTILE_CONT(0.25) WITHIN GROUP(ORDER BY RAM_PERCENTUAL) OVER(PARTITION BY 1) AS valPrimeiroQuartil,
    PERCENTILE_CONT(0.75) WITHIN GROUP(ORDER BY RAM_PERCENTUAL) OVER(PARTITION BY 1) AS valTerceiroQuartil
    from TBL_LEITURA WHERE COD_MAQUINA = \'${codMaquina}'`, res);
})

router.get('/usuario/maquina/analytics/hd/percentual/:idMaquina?', (req, res) =>{
	let codMaquina = parseInt(req.params.idMaquina);
    execSQLQuery(`SELECT DISTINCT MIN(HD_PERCENTUAL) OVER(PARTITION BY 1) AS valMin, 
    MAX(HD_PERCENTUAL) OVER(PARTITION BY 1) AS valMax,
    PERCENTILE_CONT(0.5) WITHIN GROUP(ORDER BY HD_PERCENTUAL) OVER(PARTITION BY 1) AS valMediana,
    AVG(CAST(HD_PERCENTUAL AS INTEGER)) OVER(PARTITION BY 1) AS valMedia,
    PERCENTILE_CONT(0.25) WITHIN GROUP(ORDER BY HD_PERCENTUAL) OVER(PARTITION BY 1) AS valPrimeiroQuartil,
    PERCENTILE_CONT(0.75) WITHIN GROUP(ORDER BY HD_PERCENTUAL) OVER(PARTITION BY 1) AS valTerceiroQuartil
    from TBL_LEITURA WHERE COD_MAQUINA = \'${codMaquina}'`, res);
})
router.get('/usuario/maquina/analytics/hd/atividade/:idMaquina?', (req, res) =>{
	let codMaquina = parseInt(req.params.idMaquina);
    execSQLQuery(`SELECT DISTINCT MIN(HD_TEMPO_ATIVIDADE_PERCENTUAL) OVER(PARTITION BY 1) AS valMin, 
    MAX(HD_TEMPO_ATIVIDADE_PERCENTUAL) OVER(PARTITION BY 1) AS valMax,
    PERCENTILE_CONT(0.5) WITHIN GROUP(ORDER BY HD_TEMPO_ATIVIDADE_PERCENTUAL) OVER(PARTITION BY 1) AS valMediana,
    AVG(CAST(HD_TEMPO_ATIVIDADE_PERCENTUAL AS INTEGER)) OVER(PARTITION BY 1) AS valMedia,
    PERCENTILE_CONT(0.25) WITHIN GROUP(ORDER BY HD_TEMPO_ATIVIDADE_PERCENTUAL) OVER(PARTITION BY 1) AS valPrimeiroQuartil,
    PERCENTILE_CONT(0.75) WITHIN GROUP(ORDER BY HD_TEMPO_ATIVIDADE_PERCENTUAL) OVER(PARTITION BY 1) AS valTerceiroQuartil
    from TBL_LEITURA WHERE COD_MAQUINA = \'${codMaquina}'`, res);
})

router.get('/usuario/maquina/analytics/cpu/:idMaquina?', (req, res) =>{
	let codMaquina = parseInt(req.params.idMaquina);
    execSQLQuery(`SELECT DISTINCT MIN(CPU_PERCENTUAL) OVER(PARTITION BY 1) AS valMin, 
    MAX(CPU_PERCENTUAL) OVER(PARTITION BY 1) AS valMax,
    PERCENTILE_CONT(0.5) WITHIN GROUP(ORDER BY CPU_PERCENTUAL) OVER(PARTITION BY 1) AS valMediana,
    AVG(CAST(CPU_PERCENTUAL AS INTEGER)) OVER(PARTITION BY 1) AS valMedia,
    PERCENTILE_CONT(0.25) WITHIN GROUP(ORDER BY CPU_PERCENTUAL) OVER(PARTITION BY 1) AS valPrimeiroQuartil,
    PERCENTILE_CONT(0.75) WITHIN GROUP(ORDER BY CPU_PERCENTUAL) OVER(PARTITION BY 1) AS valTerceiroQuartil
    from TBL_LEITURA WHERE COD_MAQUINA = \'${codMaquina}'`, res);
})

router.post('/usuario/cadastro/alerta', (req, res) =>{
    const descricao = req.body.descricao.substring(0,150);
    execSQLQuery(`INSERT INTO TBL_ALERTAS(DESCRICAO) VALUES('${descricao}')`, res);
})


router.post('/usuario/cadastro', (req, res) =>{
    const email = req.body.email.substring(0,150);
    const senha = req.body.senha.substring(0, 150);
    execSQLQuery(`INSERT INTO TBL_USUARIO(email, senha) VALUES('${email}','${senha}')`, res);
})

router.post('/usuario/cadastro/maquina', (req, res) =>{
	const codMaquina = parseInt(req.body.codMaquina);
    const nomeMaquina = req.body.nomeMaquina.substring(0,150);
	const codUsuario = parseInt(req.body.codUsuario);
    const ativa = req.body.ativa.substring(0, 150);
    execSQLQuery(`INSERT INTO TBL_MAQUINA(COD_MAQUINA, NOME_MAQUINA, COD_USUARIO, ATIVA) VALUES(${codMaquina},'${nomeMaquina}', ${codUsuario}, '${ativa}')`, res);
})


router.delete('/usuario/maquina/:idMaquina', (req, res) =>{
    execSQLQuery('DELETE FROM TBL_MAQUINA WHERE COD_MAQUINA =' + parseInt(req.params.idMaquina), res);
})

router.delete('/usuario/maquina/leitura/:idMaquina', (req, res) =>{
    execSQLQuery('DELETE FROM TBL_LEITURA WHERE COD_MAQUINA =' + parseInt(req.params.idMaquina), res);
})

