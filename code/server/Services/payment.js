require('dotenv').config({ path: '../.env' });
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


/**
 * vinculamos un metodo de pago a un customer
 * @param {*} data 
 * @returns paymentMethod_atach
 */
const Attach = async (data) => {
    let paymentMethod_atach = await stripe.paymentMethods.attach(
        data.paymentMethodId,
        {
            customer: data.customerId
        }
    );
    return paymentMethod_atach;
}

const Create = async (data) => {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: 2000,
        currency: 'mxn',
        payment_method_types: ['card'],
        customer: data.customerId,
        payment_method: data.paymentMethodId
    });
    return paymentIntent;
}

const Confirm = async (data) => {
    const paymentIntent = await stripe.paymentIntents.confirm(
        data.paymentIntent,
        { payment_method: data.paymentMethodId }
    );
    return paymentIntent
}

const PaymentIntent = async (data) => {
    let response = { error: [], data: { attach: [], create: [], confirm: [] }, success: 100 }
    data.customerId = data.customerId[0] ? data.customerId[0].id : "";
    let attach_response = await Attach(data).then(res => { return res }).catch(e => { console.log(e); return [] })
    let create_response = await Create(data).then(res => { return res }).catch(e => { console.log(e); return [] })
    if (attach_response !== [] && create_response !== []) {
        response.data.attach = attach_response;
        response.data.create = create_response;
        data.paymentIntent = create_response.id;
        let confirm_response = await Confirm(data).then(res => { return res }).catch(e => { console.log(e); return [] })
        if (confirm_response !== []) {
            response.data.confirm = confirm_response;
            response.error = [];
            response.success = 200;
        }
    } else {
        response.error = "Algun campo esta mal"
        console.log(attach_response, create_response)
    }
    return response
}

module.exports = {
    PaymentIntent
}
