import axios from 'axios'
const baseUrl = '/api/users'

const getAll = () => {
    //return axios.get('http://localhost:3002/entries')
    return axios.get(baseUrl)
}

const get = id => {
    return axios.get(`${baseUrl}/${id}`)
}

const create = newObject => {
    return axios.post(baseUrl, newObject)
}
const remove = id => {
    console.log('removal start')
    return axios.delete(`${baseUrl}/${id}`)
}
const update = (newObject, id) => {
    return axios.put(`${baseUrl}/${id}`, newObject)
}

export default {
 getAll,create,remove,update,get
}