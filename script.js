const App = document.getElementById('app');
const btnAdd = document.getElementById('btnAdd');
const crudList = document.getElementById('crudList');
const overlay = document.getElementById('overlay');

let pessoas = JSON.parse(localStorage.getItem('pessoas')) || [];

const modalForm = createFormModal();

function createFormModal() {
  const form = document.createElement('form');
  form.id = 'crudForm';
  form.innerHTML = `
    <h1>Preencha todos os campos</h1>
    <div class="campoForm">
      <label for="nome">Nome:</label>
      <input type="text" id="nome" required />
    </div>
    <div class="campoForm">
      <label for="idade">Idade:</label>
      <input type="number" id="idade" required />
    </div>
    <button type="submit" id="btnCrud">Salvar</button>`;

  return form;
}

const renderPessoas = () => {
  crudList.innerHTML = '';

  pessoas.forEach((pessoa, id) => {
    const li = document.createElement('li');
    li.innerHTML = `<div class="pessoa"><b>${pessoa.nome}</b> - ${pessoa.idade} anos</div>
      <div class="btns">
        <button class="editPessoa" data-key="${id}">Editar</button>
        <button class="deletePessoa" data-key="${id}">Excluir</button>
      </div>`;
    crudList.appendChild(li);
  });

  addEventListeners('.editPessoa', editPessoa);
  addEventListeners('.deletePessoa', deletePessoa);

  localStorage.setItem('pessoas', JSON.stringify(pessoas));
};

const addEventListeners = (selector, callback) => {
  const elements = document.querySelectorAll(selector);
  elements.forEach((element) => {
    element.addEventListener('click', function () {
      const id = this.getAttribute('data-key');
      callback(id);
    });
  });
};

const addPessoa = (nome, idade) => {
  const pessoa = { nome, idade };
  pessoas.push(pessoa);
  renderPessoas();
};

const editPessoa = (id) => {
  const pessoa = pessoas[id];
  modalForm.querySelector('#nome').value = pessoa.nome;
  modalForm.querySelector('#idade').value = pessoa.idade;
  modalForm.dataset.editMode = 'true';
  modalForm.dataset.editId = id;
  modalForm.addEventListener('submit', submitHandler);
  openModal();
};

const deletePessoa = (id) => {
  const confirmDelete = confirm('Tem certeza que deseja excluir esta pessoa?');
  if (confirmDelete) {
    pessoas.splice(id, 1);
    renderPessoas();
  }
};

const openModal = () => {
  if (overlay) {
    overlay.style.display = 'block';
    App.appendChild(modalForm);
    overlay.addEventListener('click', closeModal);
  }
};

const closeModal = () => {
  if (overlay) overlay.style.display = 'none';
  if (App.contains(modalForm)) App.removeChild(modalForm);
  modalForm.dataset.editMode = 'false';
  modalForm.removeAttribute('data-edit-id');
  overlay.removeEventListener('click', closeModal);
};

const submitHandler = (event) => {
  event.preventDefault();
  const nome = modalForm.querySelector('#nome').value;
  const idade = modalForm.querySelector('#idade').value;
  const editMode = modalForm.dataset.editMode === 'true';

  if (editMode) {
    const id = modalForm.dataset.editId;
    pessoas[id].nome = nome;
    pessoas[id].idade = idade;
  } else {
    if (nome && idade) {
      addPessoa(nome, idade);
    } else {
      alert('Por favor, preencha todos os campos.');
      return;
    }
  }

  renderPessoas();
  closeModal();
};

modalForm.addEventListener('submit', submitHandler);

btnAdd.addEventListener('click', openModal);
overlay.addEventListener('click', closeModal);

renderPessoas();
