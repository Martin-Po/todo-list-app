import axios from 'axios'
const baseUrl = '/api/listelements'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

let token = null

const setToken = newToken => {
    token = `Bearer ${newToken}`
}

const create = async newObject => {
    const config = {
        headers: { Authorization: token },
    }

    const response = await axios.post(baseUrl, newObject, config)
    return response.data
}

const update = async (id, newObject) => {
    console.log('en el servicio');  
    console.log(id);
    console.log(newObject);
    console.log(token);
    const config = {
        headers: { Authorization: token },
    }
    const response = await axios.put(`${baseUrl}/${id}`, newObject, config)
    return response.data
}

const remove = async (listelement) => {
    const config = {
        headers: { Authorization: token },
    }
    const response = await axios.delete(`${baseUrl}/${listelement}`, config)

    return response.data
}

export default { getAll, create, setToken, update, remove  }