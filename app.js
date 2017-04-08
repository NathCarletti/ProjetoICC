var path      = require('path');
var mysql     = require('mysql');
var static    = require('node-static');

config = {
    web:{
      host:'127.0.0.1',
      port:8000
    },
    mysql:{
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'vendas'
    }
};

// Configurar servidor de arquivos estáticos
var file = new static.Server('./web', {
  cache: 3600,
  gzip: false
});

// Configurar servidor HTTP
var server      = require('http').createServer(function(request, response){
  request.addListener('end', function (){
    file.serve(request, response);
  }).resume();
});

// Conexão MySQL
conn  = mysql.createPool({
  host     : config.mysql.host,
  user     : config.mysql.user,
  password : config.mysql.password,
  database : config.mysql.database
});

// Servidor de Socket
io = require('socket.io')(server);
    
// Iniciar servidor HTTP
server.listen(config.web.port, config.web.host, function(){
    process.stdout.write('\033c');
    console.log('[Servidor]: http://'+config.web.host+':'+config.web.port);
});

io.on('connection', function(socket){

  socket.on('login', function(dados){
    
    conn.query("SELECT * FROM usuarios WHERE login=? AND pass=?", 
      [dados.login, dados.pass], 
    function(err, res){
      if(res.length == 0){
        socket.emit('login_resposta', {status:'invalido'});
        return;
      }
      var usuario = res[0];
      socket.emit('login_resposta', {status:'success', cargo:usuario.cargo});

    });
  });
});