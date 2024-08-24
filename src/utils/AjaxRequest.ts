import axios from "axios"

export const ajax = (ajaxData) => {

    return new Promise((resolve, reject) => {

        const options = {
            headers: (ajaxData.headers) ? ajaxData.headers : null,
            method: ajaxData.method,
            params: (ajaxData.params) ? ajaxData.params : null,
            url: ajaxData.url
        };

        axios(options)
        .then(async function (response) {
            resolve(response)
        })
        .catch(error => {

            if(error.response) {

                if(error.response.status === 419) {
                    resolve({status: 419})
                } else {
                    reject(error)
                }

            } else {
                reject(error)
            }

        })

    })

}

export default ajax
