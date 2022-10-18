require('dotenv').config({ path: '../.env' });
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const SearchCustomer = async (body) => {
    const query = `email : \'${body.email}\'`;
    const search = await stripe.customers.search({
        query: query
    });

    return search.data;
}

const CreateCustomer = async (body) => {
    const create = stripe.customers.create({
        description: '',
        email: body.email,
        name: body.name
    });
    return create;
}

const CustomerService = async (body) => {
    let search = await SearchCustomer(body).then(res => { return res }).catch(e => { return [] })
    var response = { error: 500, data: [], success: 500 }
    if (search.length > 0) {
        response = { error: 500, data: search, success: 500 }
    } else {
        let create = await CreateCustomer(body).then(res => { return res }).catch(e => { return [] })
        response = { error: 100, data: create, success: 200 }
    }
    return response
}


module.exports = {
    CustomerService,
    SearchCustomer,
    CreateCustomer
}