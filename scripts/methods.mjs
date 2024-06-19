const urlAdress = 'http://localhost:3000/api/clients'
const SERVER_STATUS_OK = 200
const SERVER_STATUS_OK_ADDIT = 201

function removeServerErrorDescr() {
    for (let item of document.querySelectorAll('span.server-error-descr-show')) {
        item.classList.remove('server-error-descr-show')
    }
}

export async function getClients() {
    const response = await fetch(urlAdress)
    const data = await response.json()
    return data
}

export async function getSearchClients(search) {
    const response = await fetch(`${urlAdress}/?search=${search}`)
    const data = await response.json()
    return data
}

export async function createClient(firstName, secondName, middleName, contactsArr) {
    const response = await fetch(urlAdress, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
            name: firstName,
            surname: secondName,
            lastName: middleName,
            contacts: contactsArr
        })
    })
    let serverErrorDescr = document.querySelector('span.error-descr__new-contact')
    if (response.status === SERVER_STATUS_OK || response.status === SERVER_STATUS_OK_ADDIT) {
        serverErrorDescr.classList.add('server-error__descr-hide')
        removeServerErrorDescr()
        return true
    }
    else {
        const data = await response.json()
        serverErrorDescr.classList.remove('server-error__descr-hide')
        if (response.statusText.length > 0) {
            serverErrorDescr.textContent = `Произошла ошибка сервера.\n Код ошибки: ${response.status}.\n Описание ошибки: ${response.statusText}`
        }
        else {
            serverErrorDescr.textContent = 'Что-то пошло не так...'
        }

        if (data.errors) {
            for (let item of data.errors) {
                if (item.field === 'name') {
                    const nameServerError = document.getElementById('serverErrorNewClientName')
                    nameServerError.textContent = item.message
                    nameServerError.classList.add('server-error-descr-show')
                }
                else if (item.field === 'surname') {
                    const nameServerError = document.getElementById('serverErrorNewClientSurName')
                    nameServerError.textContent = item.message
                    nameServerError.classList.add('server-error-descr-show')
                }
            }
        }
        return false
    }
}

export async function updateClient(clientId, firstName, secondName, middleName, contactsArr) {
    const response = await fetch(`${urlAdress}/${clientId}`, {
        method: 'PATCH',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
            name: firstName,
            surname: secondName,
            lastName: middleName,
            contacts: contactsArr
        })
    })
    let serverErrorDescr = document.querySelector('span.error-descr__change-contact')
    if (response.status === SERVER_STATUS_OK || response.status === SERVER_STATUS_OK_ADDIT) {
        serverErrorDescr.classList.add('server-error__descr-hide')
        removeServerErrorDescr()
        return true
    }
    else {
        const data = await response.json()
        serverErrorDescr.classList.remove('server-error__descr-hide')
        if (response.statusText.length > 0) {
            serverErrorDescr.textContent = `Произошла ошибка сервера.\n Код ошибки: ${response.status}.\n Описание ошибки: ${response.statusText}`
        }
        else {
            serverErrorDescr.textContent = 'Что-то пошло не так...'
        }
        if (data.errors) {
            for (let item of data.errors) {
                if (item.field === 'name') {
                    const nameServerError = document.getElementById('serverErrorChangeClientName')
                    nameServerError.textContent = item.message
                    nameServerError.classList.add('server-error-descr-show')
                }
                else if (item.field === 'surname') {
                    const nameServerError = document.getElementById('serverErrorChangeClientSurName')
                    nameServerError.textContent = item.message
                    nameServerError.classList.add('server-error-descr-show')
                }
            }
        }
        return false
    }
}

export async function deleteClient(clientId) {
    const response = await fetch(`${urlAdress}/${clientId}`, {
        method: 'DELETE',
        headers: { 'Content-type': 'application/json' },
    })
    let serverErrorDescr = document.querySelector('span.error-descr__delete-contact')
    if (response.status === SERVER_STATUS_OK || response.status === SERVER_STATUS_OK_ADDIT) {
        serverErrorDescr.classList.add('server-error__descr-hide')
        return true
    }
    else {
        serverErrorDescr.classList.remove('server-error__descr-hide')
        if (response.statusText.length > 0) {
            serverErrorDescr.textContent = `Произошла ошибка сервера.\n Код ошибки: ${response.status}.\n Описание ошибки: ${response.statusText}`
        }
        else {
            serverErrorDescr.textContent = 'Что-то пошло не так...'
        }

        return false
    }
}

