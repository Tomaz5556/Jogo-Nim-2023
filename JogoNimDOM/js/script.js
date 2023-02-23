const INICIO = 0;
const ESCOLHA_JOGADOR = 1;
const REGRAS = 2;
const DENTRO_JOGO = 3;

var paginaAtual = INICIO;
var numJogadores = 0;
var vez = 1;  
var fosforosEstado = Array(15); 
var fosforosFaltantes = 16;
var finalJogo = false;

function iniciarFosforos() {
    for (var i = 0; i <= 15; i++) {
        fosforosEstado[i] = 1;
    }
}

function escolhaJogador() {
    paginaAtual = ESCOLHA_JOGADOR;
    document.getElementById("jogar").style.display = "none";
    document.getElementById("jogar-regras").style.display = "none";
    document.getElementById("jogador1").style.display = "block";
    document.getElementById("jogador2").style.display = "block";
    document.getElementById("voltar").style.display = "block";
}

function verRegras() {
    paginaAtual = REGRAS;
    document.getElementById("jogar").style.display = "none"; 
    document.getElementById("jogar-regras").style.display = "none";    
    document.getElementById("voltar").style.display = "block";
    document.getElementById("regras").style.display = "block";
    document.getElementById("exemplo").style.display = "inline";
}

function voltarAtras() {
    document.getElementById("jogar").style.display = "block";  
    document.getElementById("jogar-regras").style.display = "block";
    document.getElementById("jogador1").style.display = "none";
    document.getElementById("jogador2").style.display = "none";
    document.getElementById("regras").style.display = "none";
    document.getElementById("voltar").style.display = "none";
    
    if(paginaAtual === DENTRO_JOGO) {
        location.reload();
    }
    
    paginaAtual = INICIO;
}

function iniciarJogo(num) {
    var fosforos = document.getElementsByClassName("fosforo");

    numJogadores = num;
    paginaAtual = DENTRO_JOGO;
    
    for (var i = 0; i < fosforos.length; i++) {
        fosforos[i].style.display = "inline-block";
    }
    
    document.getElementById("jogador1").style.display = "none";
    document.getElementById("jogador2").style.display = "none";
    document.getElementById("voltar").innerHTML = "Sair";
    document.getElementById("linha1").style.display = "block";
    document.getElementById("linha2").style.display = "block";
    document.getElementById("linha3").style.display = "block";
    document.getElementById("linha4").style.display = "block";
    document.getElementById("mensagem-vez").style.display = "block";
    document.getElementById("mensagem-linha").style.display = "block";
    document.getElementById("menu-principal").style.padding = "2.5%";
    mudarMensagem();
}

function fosforosPontuacao(primeiraPeca, ultimaPeca) {
    if(numJogadores === 1 && vez === 2) {
        return 0;
    }

    const id = "fosforo";

    for (var i = primeiraPeca; i <= ultimaPeca; i++) {
        if(fosforosEstado[i-1] === 1) {
            fosforosRemovidas = id.concat(i.toString());
            document.getElementById(fosforosRemovidas).style.backgroundColor = "rgb(0,128,43)";
        }
    } 
}

function fosforosSemPontuacao(primeiraPeca, ultimaPeca) {
    const id = "fosforo";
    
    for (var i = primeiraPeca; i <= ultimaPeca; i++) {
        fosforosRemovidas = id.concat(i.toString());
        document.getElementById(fosforosRemovidas).style.removeProperty("background-color");
    } 
}

function fosforosClick(primeiraPeca, ultimaPeca) {   
    if(numJogadores === 1) {
        clickJogadorUm(primeiraPeca, ultimaPeca);
    } else {
        clickJogadorDois(primeiraPeca, ultimaPeca);
    }
}

function clickJogadorUm(primeiraPeca, ultimaPeca) {
    if(fosforosEstado[ultimaPeca-1] === 0 || finalJogo === true || vez === 2) {
        return 0;
    }

    if(pegarTodasFosforos(primeiraPeca, ultimaPeca)) {
        mostrarAviso(true);
        return 0;
    }
    
    fosforosFaltantes -= removerFosforos(primeiraPeca,ultimaPeca);
    
    if(fosforosFaltantes === 1) {
        fimJogo();
        return 0;
    }
    
    atualizarVez();  
    mostrarAviso(false);  
    mensagemComputador(1);
    setTimeout(mensagemComputador, 600, 2);
    setTimeout(mensagemComputador, 1200, 3);
    setTimeout(clickComputador, 1800);
}

function clickJogadorDois(primeiraPeca, ultimaPeca) {
    if(fosforosEstado[ultimaPeca-1] === 0 || finalJogo === true) {
        return 0;
    }

    if(pegarTodasFosforos(primeiraPeca, ultimaPeca)) {
        mostrarAviso(true);
        return 0;
    }
         
    fosforosFaltantes -= removerFosforos(primeiraPeca,ultimaPeca);       
    
    if(fosforosFaltantes === 1) {
        fimJogo();
        return 0;
    }
    
    atualizarVez();  
    mudarMensagem();
    mostrarAviso(false);
}

function clickComputador() {
    var linhaOffset = 0;
    
    if(umaLinhaRestante()) {
        linhaOffset = 1;
    }

    var escolha = Math.floor((Math.random() * (fosforosFaltantes-linhaOffset)) + 1);
    var primeiraPeca, ultimaPeca = 0;
    var contador = 0;
    var removerContagem = 0;

    for (var i = 0; i <= 16; i++) {
        if(contador === escolha) {
            ultimaPeca = i;
            break;
        }        

        if(fosforosEstado[i] === 1) {
            contador++;
        }
    }
    
    if(ultimaPeca === 1) {
        primeiraPeca = 1;
    } else if(ultimaPeca >= 2 && ultimaPeca <= 4) {
        primeiraPeca = 2;
    } else if(ultimaPeca >= 5 && ultimaPeca <= 9) {
        primeiraPeca = 5;
    } else {
        primeiraPeca = 10;
    } 
    
    fosforosFaltantes -= removerFosforos(primeiraPeca, ultimaPeca);
    
    if(fosforosFaltantes === 1) {
        fimJogo();
        return 0;
    }
    
    atualizarVez(); 
    mudarMensagem();
}

function removerFosforos(primeiraPeca, ultimaPeca) {
    const id = "fosforo";
    var removerContagem = 0;
    
    for (var i = primeiraPeca; i <= ultimaPeca; i++) {
        if(fosforosEstado[i-1] === 1) {
            removerContagem++;
            fosforosEstado[i-1] = 0;
            fosforosRemovidas = id.concat(i.toString());
            document.getElementById(fosforosRemovidas).style.opacity = 0.25;

            fosforosSemPontuacao(primeiraPeca, ultimaPeca);
        }
    }
    return removerContagem;
}

function atualizarVez() {
    vez = (vez % 2) + 1;
}

function umaLinhaRestante() {
    linhasFinalizadas = 0;
    
    if(somarFosforos(fosforosEstado[0]) === 0) {
        linhasFinalizadas++;
    }
    if(somarFosforos(fosforosEstado.slice(1,4)) === 0) {
        linhasFinalizadas++; 
    }
    if(somarFosforos(fosforosEstado.slice(4,9)) === 0) {
        linhasFinalizadas++; 
    }
    if(somarFosforos(fosforosEstado.slice(9,16)) === 0) {
        linhasFinalizadas++; 
    }

    if(linhasFinalizadas === 3) {
        return true;
    } else {
        return false;
    }

}

function mudarMensagem() {
    if(numJogadores === 2) {
        var mensagem = "É a vez do jogador ";
        mensagem = mensagem.concat(vez);
        mensagem = mensagem.concat("!");
        document.getElementById("mensagem-vez").innerHTML = mensagem; 
    } else {
        document.getElementById("mensagem-vez").innerHTML = "É a sua vez!"; 
    }    
}

function mensagemComputador(numPe) {
    mensagem = "O computador está pensando...";
    for (var i = 0; i < numPe; i++) {
        mensagem = mensagem.concat(".");
    }
    document.getElementById("mensagem-vez").innerHTML = mensagem;  
}

function mostrarAviso(display) {
    if(display) {
        document.getElementById("mensagem-vez").innerHTML = "Você não pode remover todas as peças!";
    } else {
        mudarMensagem();
    }
}

function pegarTodasFosforos(primeiraPeca, ultimaPeca) {
    removerContagem = 0;

    for (var i = primeiraPeca; i <= ultimaPeca; i++) {
        if(fosforosEstado[i-1] === 1) {
            removerContagem++;
        }
    }
    
    if(fosforosFaltantes === removerContagem) {
        return true;
    } else {
        return false;
    }    
}

function fimJogo() {
    var mensagem = "O vencedor é o jogador ";
    finalJogo = true;
    mostrarAviso(false);
    
    if(numJogadores === 2) {
        mensagem = mensagem.concat(vez);
        mensagem = mensagem.concat("!");
        document.getElementById("mensagem-vez").innerHTML = mensagem;        
    } else {
        if(vez === 1) {
            document.getElementById("mensagem-vez").innerHTML = "Você venceu!";     
        } else {
            document.getElementById("mensagem-vez").innerHTML = "Você perdeu!";             
        }
    }
    document.getElementById("voltar").innerHTML = "Jogue Novamente!";    
}

function somarFosforos(lista) {
    soma = 0;
    for (var i = 0; i < lista.length; i++) {
        soma += lista[i];
    }
    return soma;
}
