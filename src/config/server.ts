import bodyParser from 'body-parser';
import { Console } from 'console';
import cors from 'cors';
import express from 'express';
import { ParsedQs } from 'qs';
require('dotenv').config();
const dated = require('date-and-time')
"use strict";
const Gerencianet = require('gn-api-sdk-node')
const path = require('path');
const absolutePath = path.resolve(__dirname, 'credentials.js');
const credentials = require(absolutePath);
const options = credentials;
const https = require("https");
const axios = require('axios');
var fs = require("fs");
const valoresJogados: { [id: string]: number } = {};
const PORT: string | number = process.env.PORT || 5001;
var idMaquina: string | undefined;
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var inputValue: any ;
app.use(cors());

app.use(express.json());
var valorJogado: Number;
var txidmaq: string;
var valorDoPix = 0;
var valorAux = 0;
var valorAux2 : any;
var ticket = 1;
let newIdMaquina2 = idMaquina as string; 
var identificador: any;
var identificadordev: any;
var endToEndId: any;
var devendToEndId: any;
var devolutions: any;
var myId = "000123";
const idMaquinasArray: string[] = [];
const idPixRealizadosArray: string[] = [];
interface Timers {
    [txid: string]: NodeJS.Timeout; // O tipo de cada propriedade é NodeJS.Timeout
}

const timers: Timers = {}; // Crie o objeto timers com o tipo definido
app.post('/liberar-pulso', (req, res) => {
    // Lógica para liberar o pulso da máquina
    // Substitua este código com a lógica real para liberar o pulso
    const selectedId = req.body.idSelecionado;
    // Alterar o status da máquina
    
    valorDoPix = inputValue;
    txidmaq = selectedId.toString();
    identificador = txidmaq + valorDoPix;
    
   
    // Se ocorrer um erro ao liberar o pulso:
    return res.status(200).json({ retorno: 'ok', message:'ENVIANDO PULSOS AGUARDE' + identificador});
   
});
app.get('/rotapulso-app', (req, res) => {
    // Lógica para aumentar o valor jogado
    const newvalor = req.query.valor as string; 
    const newmaquina = req.query.maquina as string; 
    valorDoPix = Number( newvalor);
    txidmaq = newmaquina.toString();
    
    
   
    // Se ocorrer um erro ao liberar o pulso:
    return res.status(200).json({ retorno: 'ok', message:'ENVIANDO PULSOS AGUARDE'});
});

app.get('/aumentar-valor', (req, res) => {
    // Lógica para aumentar o valor jogado

    const entrada = identificadordev;
    const partes = entrada.split("=");
    if (partes.length === 3) {
        var idmaq = partes[0];
        var val = partes[1];
        var endt = partes[2];
        
        console.log("id maquina:", idmaq);
        console.log("valor:", val);
        console.log("endtoendid:", val);
        }



    newIdMaquina2 = req.query.idMaquina as string; 

    const index = idPixRealizadosArray.indexOf(identificadordev);
    console.log("index" + idPixRealizadosArray)
    if (index !== -1) {
        idMaquinasArray.splice(index, 1); // Remove 1 elemento no índice 'index'
        console.log("Pix R$1.00 creditado:")
    } else {
        console.log("Pix não encontrado"  )
    }
    console.log(newIdMaquina2 + "=" + valorDoPix + "=" + endToEndId);
    cancelarTemporizador(newIdMaquina2 + "=" + valorDoPix + "=" + endToEndId); // Reinicia o timer
    if( txidmaq = newIdMaquina2)
    {
        valorDoPix = 0;
    }

    if (!valoresJogados[newIdMaquina2]) {
        valoresJogados[newIdMaquina2] = 0; // Inicializa o valor se ainda não existir
    }
    valoresJogados[newIdMaquina2] += 1;
    if (!fs.existsSync(`${newIdMaquina2}.txt`)) {
        fs.writeFileSync(`${newIdMaquina2}.txt`, '0', 'utf-8'); // Cria o arquivo se não existir
    }
    else
    {
   // Atualize o valor jogado no arquivo
   fs.writeFile(`${newIdMaquina2}.txt`, valoresJogados[newIdMaquina2].toString(), (error: any) => {
    if (error) {
    console.error('Erro ao atualizar o valor jogado:', error);
    return res.status(500).json({ retorno: 'error' });
}
return res.status(200).json({ retorno: 'success' });
});
    }
 
});




function lerValorJogado(idMaquina: string): number {
    try {
       
            const filePath = `${idMaquina}.txt`;
            if (!fs.existsSync(filePath)) {
                fs.writeFileSync(filePath, '0', 'utf-8'); // Cria o arquivo se não existir
            }
    
            const valoresJogados = fs.readFileSync(filePath, 'utf8');
            return parseFloat(valoresJogados) || 0;
    } catch (error) {
        console.error(`Erro ao ler o valor jogado para a máquina ${idMaquina}:`, error);
        return 0;
    }
}


app.get('/ligar-maquina', (req, res) => {
        idMaquina = req.query.idMaquina as string | undefined;

        
        const newIdMaquina = req.query.idMaquina as string; 

    // Verifica se a string já existe no array
    if (idMaquinasArray.indexOf(newIdMaquina) === -1) {
        // Se não existir, adiciona ao array
        idMaquinasArray.push(newIdMaquina);
    }
            cancelarTemporizadorID(newIdMaquina);
  
   // Lógica para autorização ou autenticação aqui
   // Certifique-se de validar a autenticidade e autorização adequadas antes de modificar o status
   aguardarRespostaID(newIdMaquina, 25000);


   return res.status(200).send(`ID da Máquina: ${idMaquina}`); // Exibe o ID da máquina no HTML
});

app.get('/lista-maquinas', (req, res) => {
    return res.status(200).json({ idMaquinasArray });
});



function aguardarRespostaID(txid: string, timeout: number) {
    const timer = setTimeout(() => {
        const maquinaDesconectar = txid;

        const index = idMaquinasArray.indexOf(maquinaDesconectar);
        console.log("index" + idMaquinasArray)
        if (index !== -1) {
            idMaquinasArray.splice(index, 1); // Remove 1 elemento no índice 'index'
            console.log("Maquina removida:" + txid)
        } else {
            console.log("erro:" + txid)
        }
        delete timers[txid]; // Remover o temporizador após o estorno
    }, timeout);

    timers[txid] = timer;

    // ...
}

function cancelarTemporizadorID(txid: string) {
    if (timers[txid]) {
        clearTimeout(timers[txid]);
        delete timers[txid];
    }

}



app.get("/consulta-final-mac01-19c97b15", async (req, res) => {
    if (valorDoPix > 0 && valorDoPix >= ticket ) {
         
       
        var parte1 = identificador.substring(0, 11); // maquina0003
        var parte2 = identificador.substring(11);    // 1.00
        valorAux = parte2;
        //creditos
        var creditos = valorAux / ticket;
        creditos = Math.floor(creditos);
        var pulsos = creditos * ticket;
        var pulsosFormatados = ("0000" + pulsos).slice(-4);
        if(devendToEndId == parte1 + parte2)
        {
        valorAux = 0;
        }

        return res.status(200).json({ "retorno": pulsosFormatados + parte1 });
    } else {
        return res.status(200).json({ "retorno":"0000" });
    }
});







app.get("/consulta-jhony-mac01-19c97b15", async (req, res) => {
    if (valorDoPix > 0 && valorDoPix >= ticket ) {
         
        valorAux = valorDoPix;
       
        //creditos
        var creditos = valorAux / ticket;
        creditos = Math.floor(creditos);
        var pulsos = creditos * ticket;
        var pulsosFormatados = ("0000" + pulsos).slice(-4);
        if(devendToEndId == endToEndId)
        {
        valorAux = 0;
        }

        return res.status(200).json({ "retorno": pulsosFormatados + txidmaq });
    } else {
        return res.status(200).json({ "retorno":"0000" });
    }
});


app.post("/rota-recebimento", async (req, res) => {
    try {
        var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        console.log("ip");
        console.log(ip);
        var qy = req.query.hmac;
        console.log("query");
        console.log(qy);

        if (ip != '34.193.116.226') {
            return res.status(401).json({ "unauthorized": "unauthorized" });
        }


        if (qy != 'myhash1234' && qy != 'myhash1234/pix') {
            return res.status(401).json({ "unauthorized": "unauthorized" });
        }

        console.log("Novo chamada a essa rota detectada:");
        console.log(req.body);

        console.log("valor:");
        if (req.body.pix) {
            valorDoPix = req.body.pix[0].valor;
            console.log(req.body.pix[0].valor);
        }
   
        endToEndId = req.body.pix[0].endToEndId;
        txidmaq = req.body.pix[0].txid;
        devolutions = req.body.pix[0].devolucoes;   
        identificador = txidmaq + valorDoPix;
        identificadordev = txidmaq + "=" + valorDoPix + "=" + endToEndId;  
        console.log("identificador: " + identificador);
        console.log("identificador dev: " + identificadordev);
            // Verifica se a string já existe no array
    if (idPixRealizadosArray.indexOf(identificadordev) === -1) {
        // Se não existir, adiciona ao array
        idPixRealizadosArray.push(identificadordev);
    }
        aguardarResposta(identificadordev, 25000);
    
    } catch (error) {
        console.error(error);
        return res.status(402).json({ "error": "error: " + error });
    }
    return res.status(200).json({ "ok": "ok" });
});

function aguardarResposta(txid: string, timeout: number) {
    const timer = setTimeout(() => {
        if(devolutions == null)
        {
            const entrada = txid;
            const partes = entrada.split("=");
            if (partes.length === 3) {
                var parte1 = partes[0];
                var parte2 = partes[1];
                var parte3 = partes[2];
                
                console.log("Parte 1:", parte1);
                console.log("Parte 2:", parte2);
                console.log("Parte 3:", parte3);
                 valorAux2 = parte2;
                 devendToEndId = parte3;
              }
                estornar();                
    
        }

        
        delete timers[txid]; // Remover o temporizador após o estorno
        
    }, timeout);

    timers[txid] = timer;

    // ...
}

function cancelarTemporizador(txid: string) {
    if (timers[txid]) {
        clearTimeout(timers[txid]);
        delete timers[txid];
    }
}





app.get('/status', (req, res) => {
    
    const uniqueIds = Array.from(new Set(idMaquinasArray));
    const optionsHtml = uniqueIds.map(id => `<option value="${id}">${id}</option>`).join('');
    console.log("1: " + uniqueIds)
    console.log("2: " + optionsHtml)

    const statusHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>EasyPix Status</title>
    </head>
    <body>
        <h1 style="text-align: center;">
            <span style="color:#008080;"><span style="font-size:72px;">EasyPix Status:</span></span>
        </h1>
        <h1 style="text-align: center;">
            <input alt="" src="https://devtools.com.br/img/pix/logo-pix-png-icone-520x520.png" style="width: 256px; height: 256px;" type="image" />
        </h1>
        <h1 style="text-align: center;">
            <span style="font-size:48px;">IDs de Máquinas Conectadas:</span>
        </h1>
        <form action="/liberar-pulso" method="POST">
            <p style="text-align: center;">
                <label for="idSelecionado">Selecione um ID:</label>
                <select id="idSelecionado" name="idSelecionado">
                    ${optionsHtml}
                </select>
                <input type="hidden" id="selectedId" name="selectedId" value="">
                <button type="submit">Liberar Pulso</button>
            </p>
        </form>
        <p style="text-align: center;">
            <span style="font-size:48px;"><strong>Pulso Definido:</strong> <span style="color:#000000;"><strong><span style="background-color:#ffffff;">${inputValue}</span></strong></span></span>
        </p>
        <p style="text-align: center;">
            <input id="novoValor" min="0" name="novoValor" step="1" style="font-size: 48px;" type="number" />
        </p>
        <p style="text-align: center;">
            <button id="definirValorButton" style="font-size: 48px;">Definir Pulso</button>
            <p style="text-align: center;">
            <button id="verValorButton" style="font-size: 48px;">Ver Valor Jogado</button>
            <input type="hidden" id="selectedId" name="selectedId" value="">
        </p>
        <p style="text-align: center;">
            <button id="zerarValorButton" style="font-size: 48px;">Zerar Valor Jogado</button>
            <input type="hidden" id="selectedId" name="selectedId" value="">
        </p>
        <p style="text-align: center;">
            <span style="font-size:48px;"><strong>Valor Jogado:</strong> <span id="valorJogadoDiv"></span></span>
        </p>
        <script>
            document.getElementById('idSelecionado').addEventListener('change', (event) => {
                const selectedOption = event.target.value; // Valor da opção selecionada
                document.getElementById('selectedId').value = selectedOption;
            });
    
            document.getElementById('verValorButton').addEventListener('click', async () => {
                const selectedId = document.getElementById('idSelecionado').value;
                const response = await fetch('/mostrar-valor', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ selectId: selectedId })
                });
    
                if (response.status === 200) {
                    const data = await response.json();
                    const valorJogado = data.valor;
                    document.getElementById('valorJogadoDiv').textContent = valorJogado;
                } else {
                    alert('Erro ao obter o valor jogado.');
                }
            });
    
            // Evento de clique para o botão "Definir Pulso"
            document.getElementById('definirValorButton').addEventListener('click', async () => {
                const novoValor = document.getElementById('novoValor').value;
                const response = await fetch('/setar_pulsos?valor=' + novoValor);
                const data = await response.json();
                if (data.retorno === 'success') {
                    window.location.reload();
                } else {
                    alert('Erro ao definir novo valor jogado.');
                }
            });
    
            // Evento de clique para o botão "Zerar Valor Jogado"
            document.getElementById('zerarValorButton').addEventListener('click', async () => {
                const selectedId = document.getElementById('idSelecionado').value;
                const response = await fetch('/zerar-valor', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ selectId: selectedId })
                });
                const data = await response.json();
                if (data.retorno === 'success') {
                    window.location.reload();
                } else {
                    alert('Erro ao zerar valor jogado.');
                }
            });
        </script>
        <style type="text/css">
            body {
                font-size: 48px;
            }
            label, select {
                font-size: 48px;
            }
            button {
                font-size: 48px;
            }
        </style>
    </body>
    </html>
    

    `;
    res.send(statusHTML);
});

app.post('/mostrar-valor', (req, res) => {
    const slcId = req.body.selectId; // Extrai o valor do campo selectId do corpo da requisição

    // Lógica para obter o valor jogado associado ao selectId
    valorJogado = lerValorJogado(slcId);
    console.log("id:" + slcId)
    console.log("Valor:" + valorJogado)
 
    return res.status(200).json({ retorno: slcId, valor: "R$:"+valorJogado+",00" });
});








app.get('/setar_pulsos', (req, res) => {
    inputValue = req.query.valor; // Obtém o valor passado como parâmetro na URL
    
    // Faça o processamento necessário com o novoValor, como atualizar o valor no servidor
    const retorno = { retorno: 'success' }; // Supondo que a operação tenha sido bem-sucedida
    res.json(retorno);
});


function generateRandomId(length: number) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomId = '';
    
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomId += characters.charAt(randomIndex);
    }
    
    return randomId;
  }
  app.post('/zerar-valor', (req, res) => {
    // Zerar o valor jogado da máquina selecionada no campo selectedId
    const selectedId = req.body.selectId; // Obtém o valor do campo selectedId

    if (!selectedId) {
        return res.status(400).json({ retorno: 'error', message: 'Nenhum ID selecionado' });
    }

    // Lógica para zerar o valor jogado da máquina com o ID selecionado
    // Exemplo: valoresJogados[selectedId] = 0;

    // Atualize o valor jogado no arquivo (se necessário)
    fs.writeFile(`${selectedId}.txt`, '0', (error: any) => {
        if (error) {
            console.error(`Erro ao zerar o valor jogado para a máquina ${selectedId}:`, error);
            return res.status(500).json({ retorno: 'error' });
        }
        return res.status(200).json({ retorno: 'success' });
    });
});




async function estornar() {
    const randomId = generateRandomId(Math.floor(Math.random() * 8) + 5);
    myId = randomId;

     let body = {
       valor: valorAux2,
   }
   
   let params = {
       e2eId: devendToEndId,
       id: myId,
   }
   
   const gerencianet = new Gerencianet(options)
   
   gerencianet.pixDevolution(params, body)
       .then((resposta: any) => {
           console.log(resposta)
       })
       .catch((error: any) => {
           console.log(error)
       })


 }
//código escrito por Lucas Carvalho em meados de Junho de 2023...
//git push heroku main
app.listen(PORT, () => console.log(`localhost:${PORT}`)); 