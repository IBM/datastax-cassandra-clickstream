# Capture clickstream data from your ecommerce web site using a highly scalable low latency distributed database

In this code pattern, we will create a database of ecommerce clickstream data with DataStax Enterprise (DSE) or Apache Cassandra. Using Red Hat OpenShift and the DataStax Kubernetes Operator for Apache Cassandra, you can deploy this distributed database on-premise, or on your cloud provider of choice with a unified OpenShift experience. If you prefer a database-as-a-service provider, get up and running quickly with Databases for DataStax on IBM Cloud.

When you have completed this code pattern, you will understand how to:

* Select a cloud, cluster, or development platform for Apache Cassandra or DataStax Enterprise (DSE)
* Provision DSE or a DataStax distribution of Apache Cassandra
* Design and create a database for DSE
* Use CQL and CQLSH to create and query your database
* Use the Node.js client to interact with your database

![architecture](doc/source/images/architecture.png)

## Flow

1. Users interact with ecommerce web site
1. Web pages and components capture clicks
1. Clickstream data is stored in a fast-write highly scalable database

## About DataStax and Cassandra

**Apache Cassandra** is an open source NoSQL distributed database. Cassandra graduated to a top-level Apache project over a decade ago and has been (and consistently continues to be) an incredibly popular choice. Thousands of companies rely on Cassandra.

**DataStax** is a company that is focused on Cassandra. In addition to being one of the top contributors to open source Cassandra, DataStax also provides DataStax Enterprise (DSE) -- built on Apache Cassandra and enhanced for enterprise use cases.

Whether you choose DSE or an open source distribution of Cassandra, DataStax is there to provide support, consulting and much more. Even if you start with the open source version of Cassandra, you won't get far before you realize that DataStax is helping you. For example, in this code pattern we'll need a client driver to connect to Cassandra from Node.js. That driver is provided by DataStax. We also use the CQLSH tool to interact with the database. We download that tool from DataStax.

## NoSQL, SQL, and CQL

Cassandra is often considered a "NoSQL" database, but as you use it, you will see a language that sure looks like SQL. That's awkward. First of all, it might help to say that "NoSQL" is short for "not only SQL" (or maybe just don't use that term at all). The key thing to remember is that Cassandra was designed to excel and some things that traditional relation databases are not so good at. Along with the benefits of this specialization, Cassandra also comes with some things that you cannot or should not do.

In this code pattern, you will create a database that is distributed and highly scalable. Cassandra is optimized for low latency fast writes. Reads across partitions are more expensive. Our data model will need to consider what queries will need to be supported with denormalized tables. In some cases, queries that you might use with a traditional relational database (RDBMS) will not be allowed (or you might get a warning).

For specifics about the query language, refer to [The Cassandra Query Language (CQL)](http://cassandra.apache.org/doc/latest/cql/index.html). CQL will be familiar to SQL users, but you will want to keep the CQL documentation bookmarked while you learn the differences.

# Steps

1. Deploy DSE (or Apache Cassandra)
1. Interact with your database using CQL and CQLSH
1. Interact with your database using the DataStax Node.js clients
## Step 1. Deploy DSE (or Apache Cassandra)

You can provide your own deployment of DSE for this code pattern. For more specific deployment instructions, we'll focus on OpenShift using an Operator on RedHat Marketplace or Databases for DataStax on IBM Cloud.

* Get a fully managed database-as-a-service with [IBM Cloud Databases for DataStax](https://www.ibm.com/cloud/blog/announcements/ibm-cloud-databases-for-datastax).
* Avoid vendor lock-in with an OpenShift cluster running on any cloud or on-premise.

![datastax_platforms](doc/source/images/datastax_platforms.png)

Choose your platform and spin up a database:

* [Databases for DataStax on IBM Cloud](https://cloud.ibm.com/catalog/services/databases-for-cassandra)
* [DataStax Operator on OpenShift](doc/source/crc.md)

## Step 2. Interact with your database using CQL and CQLSH

Similar to all popular databases, perhaps the most common way to interact with your database is with a terminal shell and an interactive query tool. This is at the very least a tool you should have handy, and so it is how we'll get started.

For Cassandra, the tool is CQLSH. We'll demonstrate 2 ways of using CQLSH.

1. Running CQLSH on a Cassandra container with a remote shell
1. Running CQLSH locally and connecting to an external database

### Using a remote shell

When you deploy using the DataStax Operator on OpenShift, you can run `cqlsh` using a remote shell to a container. This is convenient because `cqlsh` is already provided. It can also be a security feature. Although you would need access to the container to set it up, working this way allows you to have a database that is isolated to the cluster.

Using the OpenShift `oc` command line, you can use the following commands:

* `oc login` to login
* `oc rsh` to run a remote shell
* `oc rsync` if you need to copy a file

### Running CQLSH locally

You can securely connect to a database with a public endpoint using CQLSH and a "secure connect bundle". This is typically how you would interact with a DBaaS, so we'll use Databases for DataStax on IBM Cloud as our example for running CQLSH locally and establishing a secure connection to remote database.

#### Set your admin password

Before connecting to your DataStax service, you must set your admin password as described [here](https://cloud.ibm.com/docs/databases-for-cassandra?topic=databases-for-cassandra-admin-password).

#### Download CQLSH

![download_cqlsh.png](doc/source/images/download_cqlsh.png)

* Browse to [https://downloads.datastax.com/#cqlsh](https://downloads.datastax.com/#cqlsh)
* Select the your version
* Click the box if you agree to the terms
* Hit the **Download** button
* Extract the zip file:
  * On some platforms, double-click on the `.gz` file to unzip it
  * Or use the tar command: `tar -xvf cqlsh-<version>-bin.tar.gz`
* The `cqlsh` executable is under the `bin` subdirectory

#### Get your secure connection bundle

Download the credentials from your provisioned service on IBM Cloud. They come in a zip file and include information about the hostname and certificates you can use for SSL based auth.

#### Connect using CSQLSH

Provide your user, password and path to the compressed file that contains the certificate to the CQLSH command:

```shell
./bin/cqlsh -u admin -p <password> -b /<path_to_secure-connect-bundle.zip>
```

#### Example output

```shell
markstur@Marks-MacBook-Pro-2 cqlsh-6.8.5 % ./bin/cqlsh -u admin -p <admin-password> -b ../e5f60a65-3e97-40e7-9aef-14807b4be719-public.zip
Connected to datastax_enterprise at 127.0.0.1:9042.
[cqlsh 6.8.0 | DSE 6.8.7 | CQL spec 3.4.5 | DSE protocol v2]
Use HELP for help.
admin@cqlsh>
```

### Create a keyspace

Using CQLSH, create a keyspace to use. In our examples, we use "ks1" as the keyspace name.

```shell
CREATE KEYSPACE IF NOT EXISTS ks1 
WITH replication = {
  'class' : 'SimpleStrategy',
  'replication_factor' : 1
};

USE ks1;
```

### Create tables

See DataStax documentation for [CREATE TABLE](https://docs.datastax.com/en/dse/6.8/cql/cql/cql_reference/cql_commands/cqlCreateTable.html).

#### Create a table with a simple key

When there is a one primary key column, it is also used as the partition key. You can specify `PRIMARY KEY` in the column definition.

```shell
CREATE TABLE IF NOT EXISTS ks1.product (
  product TEXT PRIMARY KEY,
  demand INT
);
```

#### Create a table with a compound key

When there are multiple columns in the key, use a separate `PRIMARY KEY (column_list)` as shown below. The additional parenthesis is used to indicate which part of the key should be used as the partition key.

```shell
CREATE TABLE IF NOT EXISTS ks1.plant_product (
  plant TEXT,
  product TEXT,
  cost DECIMAL,
  capacity INT,
  PRIMARY KEY ((plant), product)
);
```

> NOTE: In CQLSH colors indicate partition and primary key columns.

![img_2.png](doc/source/images/img_2.png)

### Insert/Update (upsert) data

In CQL, both the INSERT and the UPDATE commands act like an "UPSERT" unless "IF NOT EXISTS" is used on INSERT.  That is, a row will be inserted if the key values are new, but if a row already exists with those key values, then it will be updated.

See DataStax documentation for [UPDATE](https://docs.datastax.com/en/dse/6.8/cql/cql/cql_reference/cql_commands/cqlUpdate.html)

```shell
UPDATE ks1.product
  SET demand = 300
  WHERE product = 'handSanitizer';
```

```shell
UPDATE ks1.product
  SET demand = 500
  WHERE product = 'mask';
```

![img_3.png](doc/source/images/img_3.png)


### Using batches

See DataStax documentation for [using batch](https://docs.datastax.com/en/dse/6.8/cql/cql/cql_using/useBatch.html) and the [BATCH](https://docs.datastax.com/en/dse/6.8/cql/cql/cql_reference/cql_commands/cqlBatch.html) command.

* You can use BATCH to group commands and:
  * Reduce round trip latency
  * Treat the commands as one atomic unit
* For performance reasons, you should never have a BATCH go across partitions.

Try the following simple example.  Batches are used to update both capacity settings for a plant in a single unit.

Each plant is in a separate batch, so that the batch does not need to span partitions.

```shell
BEGIN BATCH
UPDATE ks1.plant_product
  SET cost = 500, capacity = 10
  WHERE plant = '1'
    AND product = 'mask';
UPDATE ks1.plant_product
  SET cost = 500, capacity = 10
  WHERE plant = '1'
    AND product = 'handSanitizer';
APPLY BATCH;

BEGIN BATCH
UPDATE ks1.plant_product
  SET cost = 500, capacity = 20
  WHERE plant = '2'
    AND product = 'mask';
UPDATE ks1.plant_product
  SET cost = 500, capacity = 20
  WHERE plant = '2'
    AND product = 'handSanitizer';
APPLY BATCH;
    
BEGIN BATCH
UPDATE ks1.plant_product
  SET cost = 500, capacity = 30
  WHERE plant = '3'
    AND product = 'mask';
UPDATE ks1.plant_product
  SET cost = 500, capacity = 30
  WHERE plant = '3'
    AND product = 'handSanitizer';
APPLY BATCH;

BEGIN BATCH
UPDATE ks1.plant_product
  SET cost = 500, capacity = 40
  WHERE plant = '4'
    AND product = 'mask';
UPDATE ks1.plant_product
  SET cost = 500, capacity = 40
  WHERE plant = '4'
    AND product = 'handSanitizer';
APPLY BATCH;
```

### Using insert without upserting

See DataStax documentation for [INSERT](https://docs.datastax.com/en/dse/6.8/cql/cql/cql_reference/cql_commands/cqlInsert.html).

A simple example to insert a row without allowing an update of an existing row.

```shell
INSERT INTO ks1.product_demand (
  product, demand
) values (
  "handSanitizer", 100
)
 IF NOT EXISTS;
```

## Setup for the clickstream data

### Create the table in your namespace

```shell
CREATE TABLE IF NOT EXISTS ks1.clickstream (
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
);
```

### Configure your .env file

* Copy **env.sample** to **.env**
* Edit **.env** to set your:
  * secure bundle zip path
  * username
  * password
  * keyspace name

```bash
# DataStax connection parameters
DSE_SECURE_CONNECT_BUNDLE=/Users/<your-user>/Downloads/e5f60a65-3e97-40e7-9aef-14807b4be719-public.zip
DSE_USERNAME=<your-username>
DSE_PASSWORD=<your-password>
DSE_KEYSPACE=<your-keyspace-name>

# The app uses NEXTAUTH_URL (for signin/signout)
NEXTAUTH_URL=http://localhost:8080
```

### Use the ecommerce Node.js app for live clicks

TODO: Document the web app

#### Start the Next.js app in dev mode

```bash
npm run dev
```

> NOTE: For production you would build with `npm run build` and then start with `npm start`.

#### Browse and click

http://localhost:8080

#### Notice the data in logs and the table

* TODO: Clean logging example after cleaned up
* TODO: Clean query example

## Links

* [A Brief Overview of the Database Landscape](https://www.ibm.com/cloud/blog/brief-overview-database-landscape)
* [About cloud databases](https://www.ibm.com/cloud/learn/cloud-database?mhsrc=ibmsearch_a&mhq=databases)
* [IBM Cloud Databases: SQL and NoSQL](https://www.ibm.com/cloud/blog/sql-vs-nosql)
* [How to choose a database on IBM Cloud](https://www.ibm.com/cloud/blog/how-to-choose-a-database-on-ibm-cloud)

## License

This code pattern is licensed under the Apache License, Version 2. Separate third-party code objects invoked within this code pattern are licensed by their respective providers pursuant to their own separate licenses. Contributions are subject to the [Developer Certificate of Origin, Version 1.1](https://developercertificate.org/) and the [Apache License, Version 2](https://www.apache.org/licenses/LICENSE-2.0.txt).

[Apache License FAQ](https://www.apache.org/foundation/license-faq.html#WhatDoesItMEAN)
