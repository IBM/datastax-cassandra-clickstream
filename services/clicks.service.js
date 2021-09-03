const { Client, types, auth } = require('dse-driver');
const protocolVersion = types.protocolVersion;
const PlainTextAuthProvider = auth.PlainTextAuthProvider;

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

// Don't try using v5-beta with the current driver (for now)
const options = { protocolOptions: { maxVersion: protocolVersion.v4 } };

// DSE_USERNAME (from .env file) or "username" from cluster1-superuser secret
const username = process.env.DSE_USERNAME || process.env.username;
const password = process.env.DSE_PASSWORD || process.env.password;
const keyspace = process.env.DSE_KEYSPACE || 'ks1';  // default ks1

const secureConnectBundle = process.env.DSE_SECURE_CONNECT_BUNDLE;
if (secureConnectBundle) {  // IBM Cloud Databases for DataStax
    // Remote secure connection to DBaaS (e.g. IBM Cloud)
    options.cloud = { secureConnectBundle };
    options.credentials = { username, password };
    options.keyspace = keyspace;
} else {  // cass-operator on OpenShift
    // cass-operator service accessible within the cluster
    options.contactPoints = ['cluster1-dc1-service'];
    options.localDataCenter = 'dc1';
    options.keyspace = keyspace;
    options.authProvider = new PlainTextAuthProvider(username, password);
}

const client = new Client(options);
client.connect(function (err) {
    if (err) {
        console.error(err);
        } else {
            console.log('Connected to cluster with %d host(s): %j',
                client.hosts.length, client.hosts.keys());
        }
});

function execCQL(query, params) {

    const options = { prepare: true };
    // Execute a query
    if (client.execute) {
        client.execute(query, params, options)
            .then(r => console.log("execCQL sent: ", query, params))
            .catch(r => console.log("execCQL error: ", r.message));
    } else {
        console.log('Not connected to a database for execCQL');
    }
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
