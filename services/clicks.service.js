const { Client } = require('dse-driver');

async function addToCart(product, category, price) {

    let customer_id = 345678
    console.log("Add to cart : ", customer_id, product, category );

    const query = "INSERT into ks1.clickstream (" +
        "customer_id, time_stamp, click_event_type, product_name, product_category, product_price, " +
        "total_price_of_basket, total_number_of_items_in_basket, total_number_of_distinct_items_in_basket, " +
        "session_duration" +
        ") values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    // TODO: 0 for some things we are not using for now.
    const params = [parseInt(customer_id), Math.round(Date.now()/1000), 'add-to-cart', product, category, price, 0, 1, 0, 0];

    execCQL(query, params);
}

const client = new Client({
    cloud: { secureConnectBundle: process.env.DSE_SECURE_CONNECT_BUNDLE },
    credentials: { username: process.env.DSE_USERNAME, password: process.env.DSE_PASSWORD }
});
client.connect(function (err) {
    if (err) return console.error(err);
    console.log('Connected to cluster with %d host(s): %j', client.hosts.length, client.hosts.keys());
});

function getClient() {
    return client;
}

function execCQL(query, params) {

    const options = { prepare: true };
    let client = getClient();
    // Execute a query
    client.execute(query, params, options).then(r => console.log("execCQL sent: ", query, params));
}

async function trackPageBrowsing(sessionPromise, page) {

    const session = await sessionPromise
    console.log("session->",session);

    let customer_id = session?.sub || 0;
    // console.log("Track user-page browsing : ", parseInt(user));
    console.log("Track page browsing : ", page);
    console.log("customer_id : ", customer_id);

    const query = "INSERT into ks1.clickstream (" +
        "customer_id, time_stamp, click_event_type, product_name, product_category, product_price, " +
        "total_price_of_basket, total_number_of_items_in_basket, total_number_of_distinct_items_in_basket, " +
        "session_duration" +
        ") values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    const params = [parseInt(customer_id), Math.round(Date.now()/1000), 'browsing', '', page, 0, 0, 0, 0, 0];

    execCQL(query, params);
}

export const clickService = {
    addToCart,
    trackPageBrowsing
};