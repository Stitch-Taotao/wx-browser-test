const Method = {
    GET: Symbol('GET'),
    POST: Symbol('POST')
}

let m = Method.GET
console.log(m.description)
