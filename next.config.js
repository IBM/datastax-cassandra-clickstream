
if (!process.env.NEXTAUTH_URL) {
  console.warn("NEXTAUTH_URL is not set in env! This is required for app sign-in/sign-out.");
  console.warn("NEXTAUTH_URL will default to http://localhost:8080 for local development.");
  process.env.NEXTAUTH_URL = 'http://localhost:8080';
}
console.log("NEXTAUTH_URL: ", process.env.NEXTAUTH_URL );

module.exports = {
  reactStrictMode: false,
}
