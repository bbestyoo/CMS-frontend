import { baseURL } from '@/Url'
import { getCookie } from 'cookies-next'

async function productsApi(){
    const token = getCookie('accesstoken')
    const res = await fetch (
        `${baseURL}repair/`,
        {
        headers: {
            'Authorization': `Bearer ${token}`, // Assuming it's a bearer token
        },
        credentials: 'include' // Use 'include' to send cookies with the request

    }
    )
    const result = await res.json()
    return result

}
async function postProductsApi(data){
    console.log("***********",data)
    const token = getCookie('accesstoken')
    const res = await fetch (
        `${baseURL}repair/`,
        {
            method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`, // Assuming it's a bearer token
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include' // Use 'include' to send cookies with the request

    }
    )
    const result = await res.json()
    console.log("result",result)
    return result

}

async function patchProductsApiRepaired (formData, repair_id){
    console.log(formData)
    const {repair_status, repair_cost_price, repaired_by} = formData
    
    const token = getCookie('accesstoken')
    const res = await fetch (
        `${baseURL}repair/`,
        {
            method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({repair_id, repair_status, repair_cost_price, repaired_by}),
        credentials: 'include' // Use 'include' to send cookies with the request

    }
    
)
const result = await res.json()
return result

}
async function patchProductsApiCompleted (repair_id, amount_paid){
    const token = getCookie('accesstoken')
    const currentDate = new Date();

// Format the current date to YYYY-MM-DD
const formattedDate = currentDate.toISOString().split('T')[0];

console.log(formattedDate);

    const res = await fetch (
        `${baseURL}repair/`,
        {
            method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({repair_id, "repair_status": "Completed", "amount_paid": amount_paid, "delivery_date":formattedDate}),
        credentials: 'include' // Use 'include' to send cookies with the request

    }
    
)
const result = await res.json()
return result

}
async function patchProductsApiUnrepairable (repair_id){
    console.log("asdid",repair_id)
    const token = getCookie('accesstoken')
    const res = await fetch (
        `${baseURL}repair/`,
        {
            method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({repair_id, "repair_status": "Unrepairable"}),
        credentials: 'include' // Use 'include' to send cookies with the request

    }
    
)
const result = await res.json()
return result
   
}

async function getSearchProductsApi(searchQuery){
    console.log("hereinsideapi",searchQuery)    
    const token = getCookie('accesstoken')
    const res = await fetch (
        `${baseURL}repair/search?${searchQuery}`,
        {
        headers: {
            'Authorization': `Bearer ${token}`, // Assuming it's a bearer token
        },
        credentials: 'include' // Use 'include' to send cookies with the request

    }
    )
    const result = await res.json()
    return result

}

async function productsProfitApi(){
    const token = getCookie('accesstoken')
    const res = await fetch (
        `${baseURL}enterprise/profit/`,
        {
        headers: {
            'Authorization': `Bearer ${token}`, // Assuming it's a bearer token
        },
        credentials: 'include' // Use 'include' to send cookies with the request

    }
    )
    const result = await res.json()
    return result

}

async function userInfo(){
    const token = getCookie('accesstoken')
    const res = await fetch (
        `${baseURL}enterprise/techs/`,
        {
        headers: {
            'Authorization': `Bearer ${token}`, // Assuming it's a bearer token
        },
        credentials: 'include' // Use 'include' to send cookies with the request

    }
    )
    const result = await res.json()
    return result

}

async function editProductDetails (formData){
    console.log(formData)
    const token = getCookie('accesstoken')
    const res = await fetch (
        `${baseURL}repair/`,
        {
            method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include' // Use 'include' to send cookies with the request

    }
    
)
const result = await res.json()
return result

}


export  {
    productsApi,
    postProductsApi,
    patchProductsApiRepaired,
    patchProductsApiCompleted,
    patchProductsApiUnrepairable,
    getSearchProductsApi,
    productsProfitApi,
    userInfo,
    editProductDetails,


}