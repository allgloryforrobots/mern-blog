import axios from 'axios'


// console.log(process.env)
const instance = axios.create({
    baseURL: 'http://localhost:4444'
})

instance.interceptors.request.use((config) => {
    config.headers.Authorization = window.localStorage.getItem('token')
    return config
})

export default instance