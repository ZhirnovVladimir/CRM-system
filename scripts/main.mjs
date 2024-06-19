import * as methods from "./methods.mjs"
import * as scripts from "./scripts.mjs"

let localClientsArr
const FILTER_TIMEOUT = 300
const tableBody = document.getElementById('tableBody')
const loadingAnimation = document.getElementById('loading-container')
const addNewContactButton = document.getElementById('addNewContactButton')
const addNewContactForm = document.getElementById('addNewClientForm')
const addNewClientButton = document.getElementById('addNewClientBtn')
const addNewClientContainer = document.getElementById('addNewClientContainer')
const changeClientContainer = document.getElementById('changeClientContainer')
const deleteClientContainer = document.getElementById('deleteClientContainer')
const blockingContainer = document.getElementById('blockContainer')

export function getClientsAndCreateTable() { //Забирает список контактов из БД и отрисосвывает таблицу
    addNewClientButton.setAttribute('disabled', '')
    methods.getClients().then(clients => {
        scripts.createClientTable(tableBody, clients)
        localClientsArr = clients
        scripts.deleteTableContacts(tableBody)
        let sortBtnId = document.getElementById('sortButtonId')
        scripts.clientListSortFilter(sortBtnId, localClientsArr)
        scripts.createClientTable(tableBody, localClientsArr)
        sortBtnId.classList.add('arrow-up')
        addNewClientButton.removeAttribute('disabled', '')
    })
}

getClientsAndCreateTable()
scripts.closeModalOnClickOutside(addNewClientContainer)

const closeCrossButton = document.querySelectorAll('button.close-modal-buttons')  //Закрытие всех модальных окон по кнопке крестика или "Отмена"
closeCrossButton.forEach((item) => {
    item.addEventListener('click', () => {
        scripts.closeModal()
        scripts.deleteModalContacts()
        scripts.setToDefaultURL()
    })
})


addNewClientButton.addEventListener('click', (e) => {                   //Открытие модального окна с добавлением нового клиента
    e.preventDefault()
    addNewClientContainer.classList.add('loading-modal')
})


addNewContactButton.addEventListener('click', () => {
    scripts.createContactForm(addNewContactForm)
    if (addNewContactButton.parentElement.children.length >= 11) {
        addNewContactButton.setAttribute('disabled', '')
    }
})


const changeNewContactButton = document.getElementById('changeNewContactButton') //Добавление новых контактов по клику в окне с изменением контактов
changeNewContactButton.addEventListener('click', () => {
    scripts.createContactForm(changeClientForm)
    if (changeNewContactButton.parentElement.children.length >= 11) {
        changeNewContactButton.setAttribute('disabled', '')
    }
})


const saveNewClientButton = document.getElementById('saveNewClient')
saveNewClientButton.addEventListener('click', () => {
    let firstName = document.getElementById('addInputName')
    let secondName = document.getElementById('addInputSurname')
    let middleName = document.getElementById('addInputMiddleName')
    let contactsArr = scripts.collectClientContacts()

    if (scripts.validateFields(secondName, firstName)) { //Валидация полей 

        const loadingChangedAnimation = document.querySelector('svg.changed-loading')
        loadingChangedAnimation.classList.add('circle_changed')

        blockingContainer.classList.add('blocking')  //Блокирование действий пользователя пока идет сохранение

        methods.createClient(firstName.value, secondName.value, middleName.value, contactsArr).then((response) => {
            if (response) {
                addNewClientContainer.classList.remove('loading-modal')
                firstName.value = ''
                secondName.value = ''
                middleName.value = ''

                addNewContactButton.removeAttribute('disabled')
                scripts.deleteModalContacts()
                scripts.deleteTableContacts(tableBody)
                getClientsAndCreateTable()
            }
            blockingContainer.classList.remove('blocking')
            loadingAnimation.classList.remove('loading')
            loadingChangedAnimation.classList.remove('circle_changed')
        })
    }
})

const saveChangeClient = document.getElementById('saveChangedClient')
saveChangeClient.addEventListener('click', (e) => {              //По нажатию на кнопку сохранить в изменении данных клиента, добавляется анимация загрузки, после выполнения запроса модальное окно закрывается, таблица перерисовывается
    let contactsArr = scripts.collectClientContacts()

    const clientIdDescr = document.querySelector('span.modal-header__id')
    const clientSurNameInput = document.getElementById('changeInputSurname')
    const clientFirstNameInput = document.getElementById('changeInputName')
    const clientMiddleNameInput = document.getElementById('changeInputMiddleName')

    if (scripts.validateFields(clientSurNameInput, clientFirstNameInput)) { //Валидация полей

        const loadingChangedAnimation = document.querySelector('svg.changed-loading')
        loadingChangedAnimation.classList.add('circle_changed')

        //Блокирование действий пользователя пока идет сохранение
        blockingContainer.classList.add('blocking')

        methods.updateClient(clientIdDescr.textContent.substring(4), clientFirstNameInput.value, clientSurNameInput.value, clientMiddleNameInput.value, contactsArr).then((response) => {
            if (response) {
                changeClientContainer.classList.remove('loading-modal')
                scripts.deleteModalContacts()
                scripts.deleteTableContacts(tableBody)
                getClientsAndCreateTable()
                scripts.setToDefaultURL()
            }
            blockingContainer.classList.remove('blocking')
            loadingAnimation.classList.remove('loading')
            loadingChangedAnimation.classList.remove('circle_changed')
        })
    }
})


const confirmDeleteBtn = document.getElementById('deleteClientButton')
confirmDeleteBtn.addEventListener('click', (e) => {
    let userId = localStorage.getItem('userId')
    blockingContainer.classList.add('blocking')  //Блокирование действий пользователя пока идет удаление
    methods.deleteClient(userId).then((response) => {
        if (response) {
            deleteClientContainer.classList.remove('loading-modal')
            scripts.deleteTableContacts(tableBody)
            getClientsAndCreateTable()
            localStorage.setItem('userId', '0')
        }
        blockingContainer.classList.remove('blocking')
    })
    e.stopPropagation()
})


const sortButtons = document.querySelectorAll('button.table-sort__button') //Сортировка
for (let btn of sortButtons) {
    btn.addEventListener('click', () => {
        scripts.clientListSortFilter(btn, localClientsArr)
        scripts.deleteTableContacts(tableBody)
        scripts.createClientTable(tableBody, localClientsArr)
    })
}



const filterInput = document.getElementById('inputFilter') //Обработка поля ввода для фильтра
let timeoutId
filterInput.addEventListener('input', () => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
        scripts.deleteTableContacts(tableBody)
        if (filterInput.value === '') {
            getClientsAndCreateTable()
        }
        else {
            methods.getSearchClients(filterInput.value).then(clients => {
                scripts.createClientTable(tableBody, clients)
            })
        }

    }, FILTER_TIMEOUT)
})



for (let item of document.querySelectorAll('input.input-add__fio')) { //При изменении данных в инпутах, ошибки убираются
    item.addEventListener('input', () => {
        item.classList.remove('error-descr')
        if (item.id.includes('Surname')) {
            item.setAttribute('placeholder', 'Введите фамилию*')
        }
        else if (item.id.includes('Middle')) {
            item.setAttribute('placeholder', 'Введите отчество')
        }
        else {
            item.setAttribute('placeholder', 'Введите имя*')
        }
    })
}