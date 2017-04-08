var btnEnv = document.getElementById('btnEnviar');
var login  = document.getElementById('login');
var pass   = document.getElementById('pass');

login.focus();
var socket = io();

btnEnv.onclick = function(){
	if(login.value==''){
		alert('Digite o nome!!');
		login.focus();
	}else{
		socket.emit('login', {
			login:login.value,
			pass:pass.value
		});
	}
}

window.onload = function(){
	socket.on('login_resposta', function(dados){
		if(dados.status != 'success'){
			alert('dados inválidos!');
			return;
		}

		if(dados.cargo == 1){
			// Redirecionar a pagina
			window.location.href = 'tabelaNor.html';
		}else if(dados.cargo == 2){
			// Redirecionar a pagina
			window.location.href = 'tabelaEst.html';
		}else if(dados.cargo == 3){
			// Redirecionar a pagina
			window.location.href = 'tabelaAdm.html';
		}

	});
}