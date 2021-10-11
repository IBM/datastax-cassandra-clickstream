const { Client, types, auth } = require('dse-driver');
const protocolVersion = types.protocolVersion;
const PlainTextAuthProvider = auth.PlainTextAuthProvider;

// Don't try using v5-beta with the current driver (for now)
const options = { protocolOptions: { maxVersion: protocolVersion.v4 } };

// Username and password (from .env file) or from cluster1-superuser secret
const username = process.env.DSE_USERNAME || process.env.username;
const password = process.env.DSE_PASSWORD || process.env.password;
const secureConnectBundle = process.env.DSE_SECURE_CONNECT_BUNDLE;
let keyspace = process.env.DSE_KEYSPACE;

if (!keyspace) {
   keyspace = 'ks1';  // hard-coded default from CQL examples
   console.warn("DSE_KEYSPACE is not set in env! Using default keyspace name 'ks1'.");
}

console.log("DSE_KEYSPACE: ", keyspace);
console.log("DSE_USERNAME: ", username);
console.log("DSE_PASSWORD is set? ", !!password);
console.log("DSE_SECURE_CONNECT_BUNDLE is set? ", !!secureConnectBundle);

if (secureConnectBundle) {  // IBM Cloud Databases for DataStax
    // Remote secure connection to DBaaS (e.g. IBM Cloud)
    console.log("Connecting with secure connect bundle.");
    options.cloud = { secureConnectBundle };
    options.credentials = { username, password };
    options.keyspace = keyspace;
} else {  // cass-operator on OpenShift
    // cass-operator service accessible within the cluster
    options.contactPoints = ['cluster1-dc1-service'];
    console.log("Connecting to: ", options.contactPoints);
    options.localDataCenter = 'dc1';
    options.keyspace = keyspace;
    options.authProvider = new PlainTextAuthProvider(username, password);
}

const client = new Client(options);
client.connect(function (err) {
    if (err) {
        console.error("!!! DATABASE CONNECT ERROR: ", err.message);
        } else {
            console.log('Connected to cluster with %d host(s): %j',
                client.hosts.length, client.hosts.keys());

            // Create the table if it doesn't already exist
            execCQL(
                `CREATE TABLE IF NOT EXISTS clickstream (
                    customer_id INT,
                    time_stamp TIMESTAMP,
                    click_event_type TEXT,
                    product_name TEXT,
                    product_category TEXT,
                    product_price DECIMAL,
                    total_price_of_basket DECIMAL,
                    total_number_of_items_in_basket INT,
                    total_number_of_distinct_items_in_basket INT,
                    session_duration INT,
                    PRIMARY KEY ((customer_id, click_event_type), time_stamp)
                  )`);
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
    console.log("SESSION: ",session);

    let customer_id = session?.sub || 0;
    console.log("CUSTOMER ID: ", customer_id);
    console.log("BROWSING PAGE: ", page);

    const query = `INSERT into clickstream (
        customer_id, time_stamp, click_event_type, product_name, product_category, product_price,
        total_price_of_basket, total_number_of_items_in_basket, total_number_of_distinct_items_in_basket,
        session_duration
        ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    // NOTE: 0 for some things we are not using for now.
    const params = [parseInt(customer_id), Math.round(Date.now()/1000), 'browsing', '', page, 0, 0, 0, 0, 0];

    execCQL(query, params);
}

async function addToCart(customer_id, product, category, price) {

    console.log("Add to cart : ", customer_id, product, category );

    const query = `INSERT into clickstream (
        customer_id, time_stamp, click_event_type, product_name, product_category, product_price,
        total_price_of_basket, total_number_of_items_in_basket, total_number_of_distinct_items_in_basket,
        session_duration
        ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    // NOTE: 0 for some things we are not using for now.
    const params = [parseInt(customer_id), Math.round(Date.now()/1000), 'add-to-cart', product, category, price, 0, 1, 0, 0];

    execCQL(query, params);
}

async function getActivity(customer_id) {

    console.log("CUSTOMER ID: ", customer_id);
    console.log("Get activity : ", customer_id );

    const query = "SELECT * from clickstream where customer_id = ? ALLOW FILTERING";
    const params = [parseInt(customer_id)];
    const options = { prepare: true };
    return await client.execute(query, params, options)
}

export const clickService = {
    addToCart,
    trackPageBrowsing,
    getActivity
};
