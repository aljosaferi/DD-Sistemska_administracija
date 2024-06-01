import axios from "axios";

export function getApiCall(url: string, params = {}) {
    return axios({
        url: url,
        method: 'GET',
        params: params
    }).then(res => res.data)
}

export function postApiCall(url: string, data = {}) {
    return axios({
        url: url,
        method: 'POST',
        data: data
    }).then(res => res.data)
}

export function deleteApiCall(url: string) {
    return axios({
        url: url,
        method: 'DELETE'
    }).then(res => res.data)
}

export function putApiCall(url: string, data = {}) {
    return axios({
        url: url,
        method: 'PUT',
        data: data
    }).then(res => res.data)
}