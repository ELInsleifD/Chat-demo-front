const megaurl = "http://localhost:4000"

export async function post(url, body) {
    let token = localStorage.getItem("token")

    const res = await fetch(megaurl + url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            "X-Auth-Token": token,
        },
        body: JSON.stringify(body)
    })
    const resjson = await res.json()
    return resjson

}

export async function get(url) {
    let token = localStorage.getItem("token")

    const res = await fetch(megaurl + url,{
        method:"GET",
        headers:{
            'Content-Type': 'application/json;charset=utf-8',
            "X-Auth-Token": token,
        },
    })
    const resjson = await res.json()
    return resjson
}

export async function put(url, body) {
    const token = localStorage.getItem("token")

    const res = await fetch(megaurl + url, {
        method:"PUT",
        headers:{
            'Content-Type': 'application/json;charset=utf-8',
            "X-Auth-Token": token,
        },
        body: JSON.stringify(body)
    })
    const resjson = await res.json()
    return resjson
}
export async function delet(url) {
    const token = localStorage.getItem("token")

    const res = await fetch(megaurl + url,{
        method:"DELETE",
        headers:{
            'Content-Type': 'application/json;charset=utf-8',
            "X-Auth-Token": token,
        },
    })
    const resjson = await res.json()
    return resjson
}