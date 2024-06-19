import * as methods from "./methods.mjs"
import * as main from "./main.mjs"

const changeNewContactButton = document.getElementById('changeNewContactButton')
const addNewContactButton = document.getElementById('addNewContactButton')


export function validateFields(clientSurNameInput, clientFirstNameInput) {  //Валдиация
    let flag = true
    if (clientSurNameInput.value.trim().length === 0) {
        flag = false
        clientSurNameInput.classList.add('error-descr')
        clientSurNameInput.setAttribute('placeholder', 'Вы не ввели фамилию')
    }
    if (clientFirstNameInput.value.trim().length === 0) {
        flag = false
        clientFirstNameInput.classList.add('error-descr')
        clientFirstNameInput.setAttribute('placeholder', 'Вы не ввели имя')
    }
    let contactsInput = document.querySelectorAll('input.input-add__contact')
    if (contactsInput.length > 0) {
        for (let item of contactsInput) {
            if (item.value.trim().length === 0) {
                flag = false
                item.classList.add('error-descr')
                item.setAttribute('placeholder', 'Вы не ввели значение контакта')
            }
        }
    }
    return flag
}

export function setToDefaultURL() {             //Возвращает значение адресной строки к дефолтному (Без якорей)
    let linkAncorIndex = window.location.href.indexOf('#')
    if (linkAncorIndex != -1) {
        history.pushState(null, null, window.location.href.slice('0', linkAncorIndex))
    }
}

export function closeModalOnClickOutside(clientContainer) { //Закрытие модального окна по клику на фон
    clientContainer.addEventListener('click', (e) => {
        if (!clientContainer.children[0].contains(e.target)) {
            clientContainer.classList.remove('loading-modal')
            deleteModalContacts()
            setToDefaultURL()
            addNewContactButton.removeAttribute('disabled')
            changeNewContactButton.removeAttribute('disabled')
        }
    })
}

export function collectClientContacts() { //Собирает массив из контактов клиентов
    let contactsContainers = document.querySelectorAll('div.modal-input__contact-container')
    let contactsArr = []
    for (let item of contactsContainers) {
        contactsArr.push({ 'type': item.children[1].value, 'value': item.children[2].value })
    }
    return contactsArr
}

export function deleteModalContacts() {
    let activeModalInputContact = document.querySelectorAll('div.modal-input__contact-container') //Удаление уже отрисованных контактов клиентов
    if (activeModalInputContact.length > 0) {
        for (let i of activeModalInputContact) {
            i.remove()
        }
    }
}

export function closeModal() {   // Закрывает модальное окно
    let activeModal = document.querySelector('div.loading-modal')
    if (activeModal !== null) {
        activeModal.classList.remove('loading-modal')
        addNewContactButton.removeAttribute('disabled')
        changeNewContactButton.removeAttribute('disabled')
    }
}

export function deleteTableContacts(tableBody) { //Удаляет все DOM элементы из таблицы
    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }
}

export function createContactForm(addNewContactForm, inputType, inputValue) {  //Добавление нового поля для контакта (передать форму и значение в input если нет значения то передать '')
    let formSelectDiv = document.createElement('div')
    let formSelect = document.createElement('select')
    let phoneOption = document.createElement('option')
    let additPhoneOption = document.createElement('option')
    let emailOption = document.createElement('option')
    let vkOption = document.createElement('option')
    let facebookOption = document.createElement('option')
    let formInput = document.createElement('input')
    let formSelectArrow = document.createElement('img')
    let deleteContactButton = document.createElement('button')
    let deleteContactButtonImg = document.createElement('img')

    if (inputType === 'phone') {
        phoneOption.setAttribute('selected', 'phone')
    }

    else if (inputType === 'additphone') {
        additPhoneOption.setAttribute('selected', 'Доп. телеофон')
    }

    else if (inputType === 'email') {
        emailOption.setAttribute('selected', 'Email')
    }

    else if (inputType === 'vk') {
        vkOption.setAttribute('selected', 'Vk')
    }

    else if (inputType === 'facebook') {
        facebookOption.setAttribute('selected', 'Facebook')
    }

    formSelect.setAttribute('required', '')
    formInput.setAttribute('type', 'text')
    formInput.setAttribute('placeholder', 'Введите данные контакта')
    formSelectArrow.setAttribute('src', './img/arrowdown.svg')
    phoneOption.setAttribute('value', 'phone')
    additPhoneOption.setAttribute('value', 'additphone')
    emailOption.setAttribute('value', 'email')
    vkOption.setAttribute('value', 'vk')
    facebookOption.setAttribute('value', 'facebook')
    deleteContactButtonImg.setAttribute('src', './img/cancel-contact.svg')
    deleteContactButton.setAttribute('type', 'button')

    formSelectDiv.className = 'container modal-input__contact-container'
    formSelect.className = 'modal-input__contact-select'
    formInput.className = 'input-add__contact'
    formSelectArrow.className = 'modal-input__contact-arrow'
    deleteContactButton.className = 'modal-input-button__contact-delete'

    phoneOption.textContent = 'Телефон'
    additPhoneOption.textContent = 'Доп. телефон'
    emailOption.textContent = 'Email'
    facebookOption.textContent = 'Facebook'
    vkOption.textContent = 'Vk'

    if (inputValue !== undefined) {
        formInput.value = inputValue
    }

    formSelect.append(phoneOption)
    formSelect.append(additPhoneOption)
    formSelect.append(emailOption)
    formSelect.append(vkOption)
    formSelect.append(facebookOption)
    deleteContactButton.append(deleteContactButtonImg)
    formSelectDiv.append(formSelectArrow)
    formSelectDiv.append(formSelect)
    formSelectDiv.append(formInput)
    formSelectDiv.append(deleteContactButton)

    addNewContactForm.insertBefore(formSelectDiv, addNewContactForm.children[addNewContactForm.children.length - 1]) //Вставляем перед кнопкой

    formInput.addEventListener('input', () => {  //Для дальнейший валдации полей
        formInput.classList.remove('error-descr')
        formInput.setAttribute('placeholder', 'Введите данные контакта')
    })

    deleteContactButton.addEventListener('click', (e) => {
        e.preventDefault()
        formSelectDiv.remove()
        if (addNewContactForm.children.length < 11) {
            addNewContactForm.children[addNewContactForm.children.length - 1].removeAttribute('disabled')
        }
        e.stopPropagation()
    })

    formSelect.addEventListener('click', () => {
        formSelectArrow.classList.toggle('modal-input__contact-arrow-rotate')
    })

    formSelect.addEventListener('blur', () => {
        formSelectArrow.classList.remove('modal-input__contact-arrow-rotate')
    })
}

export function createClientTable(tableBody, clients) {      //Отрисовка данных в таблице                            
    const changeClientContainer = document.getElementById('changeClientContainer')
    const deleteClientContainer = document.getElementById('deleteClientContainer')
    const loadingAnimation = document.getElementById('loading-container')

    for (let item of clients) {
        let tableRow = document.createElement('tr')
        let tdId = document.createElement('td')
        let tdFullName = document.createElement('td')
        let tdCreatedOn = document.createElement('td')
        let tdModifiedOn = document.createElement('td')
        let tdContacts = document.createElement('td')
        let tdContorlButtons = document.createElement('td')
        let tdCreatedOnTime = document.createElement('span')
        let tdModifiedOnTime = document.createElement('span')
        let editButton = document.createElement('a')
        let editButtonImg = document.createElement('img')
        let deleteButton = document.createElement('button')
        let deleteButtonImg = document.createElement('img')

        editButton.setAttribute('href', `#${item.id}`)
        deleteButton.setAttribute('type', 'button')
        editButtonImg.setAttribute('src', './img/edit.svg')
        deleteButtonImg.setAttribute('src', './img/red-cancel.svg')

        tdId.className = 'table-cell__text'
        tdCreatedOnTime.className = 'table-cell__text'
        tdModifiedOnTime.className = 'table-cell__text'
        editButton.className = 'btn__action'
        deleteButton.className = 'btn__action'
        tdContacts.classList.add('table-cell__contacts')



        editButton.textContent = 'Изменить'
        deleteButton.textContent = 'Удалить'

        tdId.textContent = item.id

        let correctDateCreatedOn = item.createdAt.substring(0, 10).split('-')
        let correctTimeCreatedOn = item.createdAt.substring(11, 16)

        tdFullName.textContent = `${item.surname} ${item.name} ${item.lastName}`
        tdCreatedOn.textContent = `${correctDateCreatedOn[2]}.${correctDateCreatedOn[1]}.${correctDateCreatedOn[0]} `
        tdCreatedOnTime.textContent = correctTimeCreatedOn
        if (item.createdAt === item.updatedAt) {
            tdModifiedOn.textContent = `${correctDateCreatedOn[2]}.${correctDateCreatedOn[1]}.${correctDateCreatedOn[0]} `
            tdModifiedOnTime.textContent = correctTimeCreatedOn
        }
        else {
            let correctDateModifiedOn = item.updatedAt.substring(0, 10).split('-')
            let correctTimeModifiedOn = item.updatedAt.substring(11, 16)

            tdModifiedOn.textContent = `${correctDateModifiedOn[2]}.${correctDateModifiedOn[1]}.${correctDateModifiedOn[0]} `
            tdModifiedOnTime.textContent = correctTimeModifiedOn
        }

        let counter = 1
        for (let contact of item.contacts) {
            let contactIcon = document.createElement('img')
            let contactContainerIcon = document.createElement('div')
            let contactIconDescr = document.createElement('span')

            contactContainerIcon.className = 'table-contact__container-icon'
            contactIconDescr.className = 'table-contact__descr'

            if (contact.type === 'phone') {
                contactIconDescr.textContent = contact.value
                contactIcon.setAttribute('src', './img/phone.svg')
            }
            else if (contact.type === 'vk') {
                contactIconDescr.textContent = `${contact.type}: ${contact.value}`
                contactIcon.setAttribute('src', './img/vk.svg')
            }
            else if (contact.type === 'facebook') {
                contactIconDescr.textContent = `${contact.type}: ${contact.value}`
                contactIcon.setAttribute('src', './img/fb.svg')
            }
            else if (contact.type === 'email') {
                contactIconDescr.textContent = `${contact.type}: ${contact.value}`
                contactIcon.setAttribute('src', './img/mail.svg')
            }
            else {
                contactIconDescr.textContent = `Доп. телефон: ${contact.value}`
                contactIcon.setAttribute('src', './img/uknown-contact.svg')
            }
            contactContainerIcon.append(contactIcon)
            contactContainerIcon.append(contactIconDescr)
            tdContacts.append(contactContainerIcon)

            if (item.contacts.length > 4 && counter > 4) {
                contactContainerIcon.classList.add('table-contact__container-icon-hide')
            }
            counter++
        }

        if (item.contacts.length > 4) {
            let showAllContactsBtn = document.createElement('button')
            showAllContactsBtn.classList.add('table-contacts__show-all-contacts-btn')
            showAllContactsBtn.setAttribute('type', 'button')
            showAllContactsBtn.textContent = `+${item.contacts.length - 4}`
            tdContacts.append(showAllContactsBtn)

            showAllContactsBtn.addEventListener('click', () => {
                showAllContactsBtn.classList.add('table-contacts__show-all-contacts-btn-hidden')
                for (let item of showAllContactsBtn.parentElement.children) {
                    item.classList.remove('table-contact__container-icon-hide')
                }
            })

        }


        tdCreatedOn.append(tdCreatedOnTime)
        tdModifiedOn.append(tdModifiedOnTime)

        editButton.prepend(editButtonImg)
        deleteButton.prepend(deleteButtonImg)
        tdContorlButtons.append(editButton)
        tdContorlButtons.append(deleteButton)

        tableRow.append(tdId)
        tableRow.append(tdFullName)
        tableRow.append(tdCreatedOn)
        tableRow.append(tdModifiedOn)
        tableRow.append(tdContacts)
        tableRow.append(tdContorlButtons)

        tableBody.append(tableRow)

        let linkAncorIndex = window.location.href.indexOf('#')  //Путь к модальному окну конкретного юзера
        if (linkAncorIndex != -1 && item.id === window.location.href.slice(linkAncorIndex + 1)) {
            deleteModalContacts()
            changeClientContainer.classList.add('loading-modal')
            closeModalOnClickOutside(changeClientContainer)

            const clientIdDescr = document.querySelector('span.modal-header__id')
            const clientSurNameInput = document.getElementById('changeInputSurname')
            const clientFirstNameInput = document.getElementById('changeInputName')
            const clientMiddleNameInput = document.getElementById('changeInputMiddleName')

            clientIdDescr.textContent = `ID: ${item.id} `
            clientSurNameInput.value = item.surname
            clientFirstNameInput.value = item.name
            clientMiddleNameInput.value = item.lastName

            const changeClientForm = document.getElementById('changeClientForm')

            for (let contact of item.contacts) {
                createContactForm(changeClientForm, contact.type, contact.value)
            }
        }

        deleteButton.addEventListener('click', () => {              //Логика удаления контакта
            deleteClientContainer.classList.add('loading-modal')
            closeModalOnClickOutside(deleteClientContainer)
            localStorage.setItem('userId', item.id)
        })

        editButton.addEventListener('click', () => {  //Отрисовка данных в модальное окно
            deleteModalContacts()
            closeModalOnClickOutside(changeClientContainer)
            changeClientContainer.classList.add('loading-modal')
            const clientIdDescr = document.querySelector('span.modal-header__id')
            const clientSurNameInput = document.getElementById('changeInputSurname')
            const clientFirstNameInput = document.getElementById('changeInputName')
            const clientMiddleNameInput = document.getElementById('changeInputMiddleName')

            clientIdDescr.textContent = `ID: ${item.id} `
            clientSurNameInput.value = item.surname
            clientFirstNameInput.value = item.name
            clientMiddleNameInput.value = item.lastName

            const changeClientForm = document.getElementById('changeClientForm')

            for (let contact of item.contacts) {
                createContactForm(changeClientForm, contact.type, contact.value)
            }
        })
    }
    loadingAnimation.classList.remove('loading')
}

function checkActiveSortAndDiactivate() {                   //Если выбрана другая сортировка , то текущая отменяется и стрелка поворачивается
    let activeSort = document.querySelector('button.arrow-up')
    if (activeSort !== null) {
        activeSort.classList.remove('arrow-up')
        document.getElementById('sortButtonName').children[1].textContent = 'А-Я'
    }
}

function idSort(actualList, order) {  //Функция сортировки по Id, передать в order порядок сортировки (1 обычная, -1 обратная)
    actualList.sort(function (a, b) {
        if (Number(a.id) < Number(b.id)) {
            return 1 * order
        }
        else {
            return -1 * order
        }
    })
}

function fioSort(actualList, order) {  //Функция сортировки по ФИО
    actualList.sort(function (a, b) {
        if (a.surname.toLowerCase() < b.surname.toLowerCase()) {
            return 1 * order
        }
        else if (a.surname.toLowerCase() === b.surname.toLowerCase()) {
            if (a.name.toLowerCase() < b.name.toLowerCase()) {
                return 1 * order
            }
            else if (a.surname.toLowerCase() === b.surname.toLowerCase()) {
                if (a.lastName.toLowerCase() <= b.lastName.toLowerCase()) {
                    return 1 * order
                }
                else {
                    return -1 * order
                }
            }
            else {
                return -1 * order
            }
        }
        else {
            return -1 * order
        }
    })
}

function createdModifiedSort(actualList, order, item) { //Функция соритровки по дате создания и дате изменения
    actualList.sort(function (a, b) {
        let aArr = item.id === 'sortButtonCreatedOn' ? a.createdAt.split('-') : a.updatedAt.split('-')
        let bArr = item.id === 'sortButtonCreatedOn' ? b.createdAt.split('-') : b.updatedAt.split('-')
        if (Number(aArr[0]) < Number(bArr[0])) {
            return 1 * order
        }
        else if (Number(aArr[0]) === Number(bArr[0])) {
            if (Number(aArr[1]) < Number(bArr[1])) {
                return 1 * order
            }
            else if (Number(aArr[1]) === Number(bArr[1])) {
                if (Number(aArr[2].slice(0, 2)) < Number(bArr[2].slice(0, 2))) {
                    return 1 * order
                }
                else if (Number(aArr[2].slice(0, 2)) === Number(bArr[2].slice(0, 2))) {
                    if (Number(aArr[2].slice(3, 5)) < Number(bArr[2].slice(3, 5))) {
                        return 1 * order
                    }
                    else if (Number(aArr[2].slice(3, 5)) === Number(bArr[2].slice(3, 5))) {
                        if (Number(aArr[2].slice(6, 8)) < Number(bArr[2].slice(6, 8))) {
                            return 1 * order
                        }
                        else if (Number(aArr[2].slice(6, 8)) === Number(bArr[2].slice(6, 8))) {
                            if (Number(aArr[2].slice(9, 11)) <= Number(bArr[2].slice(9, 11))) {
                                return 1 * order
                            }
                            else {
                                return -1 * order
                            }
                        }
                        else {
                            return -1 * order
                        }
                    }
                    else {
                        return -1 * order
                    }
                }
                else {
                    return -1 * order
                }
            }
            else {
                return -1 * order
            }
        }
        else {
            return -1 * order
        }
    })
}


export function clientListSortFilter(item, actualList) { // Сортировка
    if (item.id === 'sortButtonId') {                 //Сортировка по ID
        if (item.className.includes('arrow-up')) {      //Если уже отсортировано по возрастанию, то будет отсортировано по убыванию
            item.classList.remove('arrow-up')
            idSort(actualList, 1)

        }
        else {
            checkActiveSortAndDiactivate()
            item.classList.add('arrow-up')
            idSort(actualList, -1)
        }
    }

    else if (item.id === 'sortButtonName') {             //Сортировка по ФИО
        if (item.className.includes('arrow-up')) {
            item.classList.remove('arrow-up')
            item.children[1].textContent = 'А-Я'
            fioSort(actualList, 1)
        }
        else {
            checkActiveSortAndDiactivate()
            item.classList.add('arrow-up')
            item.children[1].textContent = 'Я-А'
            fioSort(actualList, -1)
        }
    }

    else {
        if (item.className.includes('arrow-up')) { //Сортировка по дате создания и дате изменения
            item.classList.remove('arrow-up')
            createdModifiedSort(actualList, 1, item)
        }
        else {
            checkActiveSortAndDiactivate()
            item.classList.add('arrow-up')
            createdModifiedSort(actualList, -1, item)
        }
    }
}
