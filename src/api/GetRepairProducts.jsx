const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
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
async function deleteProductsApi(data){
    try {
        console.log("***********", data);
        const token = getCookie('accesstoken');
        const response = await fetch(`${baseURL}repair/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`, // Assuming it's a bearer token
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ repair_id: data }),
            credentials: 'include' // Use 'include' to send cookies with the request
        });

        if (response.status === 204) {
            // No content, successful delete
            console.log("Delete successful with no content.");
            return { success: true };
        }

    } catch (error) {
        // Handle errors that occur during fetch or in response processing
        console.error("Error deleting products:", error);
        throw error; // Rethrow the error after logging it
    }

}
async function patchProductsApiOutRepair (formData, repair_id){
    console.log(formData)
    const {outside_name, outside_taken_date, taken_by, outside_desc, outside_repair } = formData
    const repair_status = 'Outrepaired'
    const token = getCookie('accesstoken')
    const res = await fetch (
        `${baseURL}repair/`,
        {
            method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({repair_id,outside_name, outside_taken_date, taken_by, outside_desc, repair_status, outside_repair }),
        credentials: 'include' // Use 'include' to send cookies with the request

    }
    
)
const result = await res.json()
return result

}
async function patchProductsApiRepaired (formData, repair_id){
    console.log(formData)
    const {repair_status, repair_cost_price, repaired_by, cost_price_description, returned_by} = formData
    const currentDate = new Date();

    // Format the current date to YYYY-MM-DD
    const formattedDate = currentDate.toISOString().split('T')[0];

    console.log("date", formattedDate);
    const token = getCookie('accesstoken')
    const res = await fetch (
        `${baseURL}repair/`,
        {
            method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({repair_id, repair_status, repair_cost_price, repaired_by, cost_price_description, outside_returned_date:formattedDate, returned_by}),
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
    deleteProductsApi,
    patchProductsApiRepaired,
    patchProductsApiCompleted,
    patchProductsApiUnrepairable,
    getSearchProductsApi,
    productsProfitApi,
    userInfo,
    editProductDetails,
    patchProductsApiOutRepair,


}