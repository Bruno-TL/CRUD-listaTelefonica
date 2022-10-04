
//Constante já definda da url do localHost, para não ter "perigo" de colocar errado ou ter que alterar em vários locais no código.
const URL = 'http://localhost:3000/'


/////////////////////////////////// CADASTRANDO /////////////////////////////////
//Função responsável por cadastar novas pessoas na lista telefônica
function cadastrar(){
    event.preventDefault();

    //colocando os dados dos inputs para a variável 'dados'
    let dados = {
        nome: input_nome.value,
        numero: input_numero.value,
        cidade: input_cidade.value,
    }

    //Realizando um fecth 'promesa' do método "post" para cadastrar os dados no db.json
    fetch(URL + 'listaTelefonica',{
        method: 'POST',
        body: JSON.stringify(dados),
        headers: {
            'Content-Type' : 'application/json'
        }
    })
    .then( response => response.json()).then( () => atualizarLista())
    .catch((error) => {
        console.error('Error:', error);
    });

    //Resetando o formulário
    formCadastar.reset();
    
    //Lógica usada para fechar offcanvas ao click em cadastar
    document.location.reload(true);
}

//////////////////////////////// ATUALIZANDO A LISTA /////////////////////////////
//Função responsável por atualizar a lista tefônica com os dados salvos no db.json.
function atualizarLista() {
    //Zerando o innerHTML para não ficar repetindo a lista toda vez que ela for atualizada.
    tabela_tbody.innerHTML = '';

    //Atualizando a lista e alimentando o html usando "map , templateString"
    fetch(URL + 'listaTelefonica')
        .then(response => response.json())
        .then(res => {
            res.map( cadaItem => {
                tabela_tbody.innerHTML += `
                <tr class="table-info border border border-3">
                    <td>${cadaItem.id}</td>
                    <td>${cadaItem.nome}</td>
                    <td>${cadaItem.numero}</td>
                    <td>${cadaItem.cidade}</td>
                    <td class="d-flex flex-row-reverse">
                        <button class="btn btn-outline-primary d-flex align-items-center" onclick="buscandoID(${cadaItem.id})" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasScrolling" aria-controls="offcanvasScrolling">
                            Editar<span class="material-icons">bolt</span>
                        </button>
                    </td>
                    <td onclick="excluir(${cadaItem.id})">
                        <button class="btn btn-outline-danger d-flex align-items-center">
                            Excluir<span class="material-icons">delete</span>
                        </button>
                    </td>
                    
                </tr>
                `
            })
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    
}

atualizarLista();

//////////////////////// EXCLUINDO //////////////////////////////////////
//Função responsável por excluir um item na lista pelo o seu ID.
async function excluir(id) {
    //Última pergunta antes de excluir totalmente o item do banco .
    let confirme = confirm('Tem certeza que quer fazer isso com a sua vida?')
    //Se ele não for excluir, simplesmente retorna "como uma mágica"
    if(confirme !== true) return ;

    //fecth de delete, para apagar o item escolhido pelo o ID
    await fetch(URL + 'listaTelefonica/' + id, {method: 'DELETE'});

    //Depois de excluir atualizar a lista
    atualizarLista();
}

///////////////////////////////// BUSCAR-ID E EDITAR ///////////////////////////
//Função que busca os dados separadamente a partir do id do item. 
function buscandoID(id) {
    event.preventDefault();

    fetch(URL + 'listaTelefonica/' + id)
        .then( response => response.json())
        .then( res => {
            input_editar_id.value = res.id;
            input_editar_nome.value = res.nome;
            input_editar_numero.value = res.numero;
            input_editar_cidade.value = res.cidade;
        })
}
//Função responsável de editar os dados que foi capiturados atráves dos inputs, iditando a linha da lista com o ID expecífico
function editar() {
    event.preventDefault();
    //Capiturando o id para ser ussdo no fetch;
    let ID = parseInt(input_editar_id.value);

    //Dados que serão usados para ser enviados e editados no db.json
    let dados = {
        nome: input_editar_nome.value,
        numero: input_editar_numero.value,
        cidade: input_editar_cidade.value,
    }

    //Usando o método 'PATCH' para editar o item utilizando o id para escolher um único item
    fetch(URL + 'listaTelefonica/' + ID,{
        method: 'PATCH',
        body: JSON.stringify(dados),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json()).then(() => atualizarLista())


    //Resetando o formulário
    form_edit.reset();
    //Lógica usada para fechar offcanvas ao click em cadastar
    document.location.reload(true);

    

}

//////////////////////FAZENDO UMA BUSCA NOS CONTATOS E FILTRANDO ///////////////////
// Função responsável por fazer a busca pelo o nome e cidade que contém na lista
function buscar() {
    //colocando a string em letras minúsculas
    let palavraDigitada = input_busca.value.toLowerCase();

    //Pegando os elementos da tag tr
    let linhas = tabela_tbody.getElementsByTagName('tr');
    
    for(let posicao in linhas){
        if(isNaN(posicao)){
            continue;
        }
        //Fazendo com que a palavra digitada seja comparada somente com a coluna de Nome e Cidade
        let colunaNome = linhas[posicao].children[1].innerText.toLowerCase();
        let colunaCidade = linhas[posicao].children[3].innerText.toLowerCase();

        //Colocando as duas variáveis em uma
        let tr = colunaNome + colunaCidade;
        
        //Criando a condição de que se a letra digitada conter na tr o ela vai aparecer na tela se no caso não conter o display dela irá receber o valor 'none'
        if(tr.includes(palavraDigitada)){
            linhas[posicao].style.display =''
        }else{
            linhas[posicao].style.display = 'none';
        }
    }
}