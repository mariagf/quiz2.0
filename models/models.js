var path = require('path');
var pg = require('pg');
var Sequelize = require('sequelize');

//Postgres DATABASE_URL = postgres://user:passwd@user:port/database
//Postgres DATABASE_URL = postgres://cnplybmegqizxe:ObEXfoMiLJ7r-NM69wGaBATnrl@ec2-23-23-81-221.compute-1.amazonaws.com:5432/d9dgatttrs63u9

//SQLite DATABASE_URL = sqlite://:@/

var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);

var DB_name = (url[6]||null);
var user = (url[2]||null);
var pwd = (url[3]||null);
var protocol = (url[1]||null);
var dialect = (url[1]||null);
var port = (url[5]||null);
var host = (url[4]||null);
var storage = process.env.DATABASE_STORAGE;

var dialect = "sqlite";

// Usar BBDD SQLite:
var sequelize = new Sequelize(DB_name, user, pwd,
			{dialect: protocol,
			protocol: protocol,
			port: port,
			host: host, 
			storage: storage, // solo SQLite (.env)
			omitNull: true // solo Postgres
			}
	);

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Importar la definición de la tabla Quiz 
var quiz_path = path.join(__dirname, 'quiz');
var Quiz = sequelize.import(quiz_path);

exports.Quiz = Quiz; //exportar definición de tabla Quiz

// sequelize.sync() crea e inicializa tabla de preguntas en DB
sequelize.sync().then(function(){
	//success(..) ejectura el manejador una vez creada la tabla
	Quiz.count().then(function(count){
		if(count===0){
			Quiz.create({ pregunta: '¿Cuál es la capital de Italia?',
						  respuesta: 'Roma'
						});
			Quiz.create({ pregunta: '¿Cuál es la capital de Portugal?',
						  respuesta: 'Lisboa'
						})
			.then(function(){console.log('Base de datos inicializada')});
		};
	});
});
