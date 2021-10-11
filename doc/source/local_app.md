# Run the web app locally

## Run locally with a remote database

Using npm and Next.js, you can run the application in your development environment. In our example, we will configure the application to connect to a DSE database on IBM Cloud.

## Configure the app

#### Configuration with a .env file

When you are running locally, it is common to set the environment variables in a hidden file in the project root directory named `.env`. The application code will read this file and set the environment variables to be used while running the app.

To run the app locally and connect to DSE on IBM Cloud, we configure the app by setting environment variables using a .env file.

In your cloned repo:

1. Copy **env.sample** to **.env**
1. Edit **.env** to set DSE_USERNAME, DSE_PASSWORD, DSE_KEYSPACE, and DSE_SECURE_CONNECT_BUNDLE.

> NOTE: You can run locally using the app's default for NEXTAUTH_URL (https://localhost:8080), but if you want to run the app at a different URL, you'll also need to uncomment and set NEXTAUTH_URL in your .env for the NextAuth sign-in/sign-out redirects.

##### env.sample

```bash
# DataStax connection parameters

DSE_SECURE_CONNECT_BUNDLE=/Users/<your-user>/Downloads/<guid>-public.zip
DSE_USERNAME=<your-username>
DSE_PASSWORD=<your-password>
DSE_KEYSPACE=<your-keyspace-name>

# If not running on localhost, set your site URL for auth.
# NEXTAUTH_URL=http://localhost:8080
```

## Start the Next.js web app in dev mode

Run the following commands to install dependencies and run the web app in dev mode.

```bash
npm install
npm run dev
```

> NOTE: For production, you would build with `npm run build` and then start with `npm start`.

## Interact with the application

Go back to the README.md and follow the instructions to interact with the application to create clickstream data in your database.

[![return](https://raw.githubusercontent.com/IBM/pattern-utils/master/deploy-buttons/return.png)](../../README.md#use-the-web-app)
