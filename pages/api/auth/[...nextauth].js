import NextAuth from "next-auth"
import Providers from "next-auth/providers"

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
    // Change default site port from 3000 to 8080 (w/ .env override).
    site: process.env.NEXTAUTH_URL || "http://localhost:8080",
    // https://next-auth.js.org/configuration/providers
    providers: [
        Providers.Credentials({
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: 'Credentials',
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            credentials: {
                username: { label: "Username", type: "text", placeholder: "Your name here" },
                password: {  label: "Password", type: "password", placeholder: "password not used" }
            },
            async authorize(credentials, req) {
                // You need to provide your own logic here that takes the credentials
                // submitted and returns either a object representing a user or value
                // that is false/null if the credentials are invalid.
                // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
                // You can also use the `req` object to obtain additional parameters
                // (i.e., the request IP address)
                // const res = await fetch("/your/endpoint", {
                    // method: 'POST',
                    // body: JSON.stringify(credentials),
                    // headers: { "Content-Type": "application/json" }
                // })
                // const user = await res.json()

                // If no error and we have user data, return it
                // if (res.ok && user) {
                    // return user
                // }
                // Return null if user data could not be retrieved
                // return null

                // Use uppercase name for consistent 2-digit character codes
                let name = credentials.username.toUpperCase().replace(/[^A-Z0-9]/g, "");
                let customer_id = [];
                console.log("NAME: ", name);

                for (let i = 0; i < name.length; i++) {
                    customer_id.push(name.charCodeAt(i));
                }

                // Hack to force this <= 21 47 48 36 47  (maxint 2147483647)
                // Packing would be better (or make the DB take a string?)
                customer_id = customer_id.slice(-5)  // take last 5 cars
                if (customer_id.length > 4) {
                    customer_id[0] = customer_id[0] % 21  // Keep it under 2100000000
                }
                // If no user name then customer_id=0
                if (customer_id.length < 0) {
                    customer_id = [0];
                }

                console.log("CUSTOMER ID: ", customer_id);
                let ret = {id: customer_id.join(''), name}
                return ret

            }
        })

    ],
    // Database optional. MySQL, Maria DB, Postgres and MongoDB are supported.
    // https://next-auth.js.org/configuration/databases
    //
    // Notes:
    // * You must install an appropriate node_module for your database
    // * The Email provider requires a database (OAuth providers do not)
    // database: process.env.DATABASE_URL,

    // The secret should be set to a reasonably long random string.
    // It is used to sign cookies and to sign and encrypt JSON Web Tokens, unless
    // a separate secret is defined explicitly for encrypting the JWT.
    // secret: process.env.SECRET,

    session: {
        // Use JSON Web Tokens for session instead of database sessions.
        // This option can be used with or without a database for users/accounts.
        // Note: `jwt` is automatically set to `true` if no database is specified.
        jwt: true,

        // Seconds - How long until an idle session expires and is no longer valid.
        // maxAge: 30 * 24 * 60 * 60, // 30 days

        // Seconds - Throttle how frequently to write to database to extend a session.
        // Use it to limit write operations. Set to 0 to always update the database.
        // Note: This option is ignored if using JSON Web Tokens
        // updateAge: 24 * 60 * 60, // 24 hours
    },

    // JSON Web tokens are only used for sessions if the `jwt: true` session
    // option is set - or by default if no database is specified.
    // https://next-auth.js.org/configuration/options#jwt
    jwt: {
        // A secret to use for key generation (you should set this explicitly)
        secret: 'verysecret',
        // Set to true to use encryption (default: false)
        // encryption: true,
        // You can define your own encode/decode functions for signing and encryption
        // if you want to override the default behaviour.
        // encode: async ({ secret, token, maxAge }) => {},
        // decode: async ({ secret, token, maxAge }) => {},
    },

    // You can define custom pages to override the built-in ones. These will be regular Next.js pages
    // so ensure that they are placed outside of the '/api' folder, e.g. signIn: '/auth/mycustom-signin'
    // The routes shown here are the default URLs that will be used when a custom
    // pages is not specified for that route.
    // https://next-auth.js.org/configuration/pages
    pages: {
        // signIn: '/auth/signin',  // Displays signin buttons
        // signOut: '/auth/signout', // Displays form with sign out button
        // error: '/auth/error', // Error code passed in query string as ?error=
        // verifyRequest: '/auth/verify-request', // Used for check email page
        // newUser: null // If set, new users will be directed here on first sign in
    },

    // Callbacks are asynchronous functions you can use to control what happens
    // when an action is performed.
    // https://next-auth.js.org/configuration/callbacks
    callbacks: {
        async signIn(user, account, profile) { return user },
        // async redirect(url, baseUrl) { return baseUrl },
        async session(session, user) { return user },
        // async jwt(token, user, account, profile, isNewUser) { return user }
    },

    // Events are useful for logging
    // https://next-auth.js.org/configuration/events
    events: {},

    // You can set the theme to 'light', 'dark' or use 'auto' to default to the
    // whatever prefers-color-scheme is set to in the browser. Default is 'auto'
    theme: 'light',

    // Enable debug messages in the console if you are having problems
    debug: false,
})