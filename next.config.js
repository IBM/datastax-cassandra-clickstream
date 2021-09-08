
if (process.env.NEXTAUTH_URL) {
  console.log("NEXTAUTH_URL is:  ", process.env.NEXTAUTH_URL );
}
else {
  console.warn("NEXTAUTH_URL is not set!");
  process.env.NEXTAUTH_URL = 'http://0.0.0.0:8080';
  console.log("Setting to:  ", process.env.NEXTAUTH_URL );
}

module.exports = {
  reactStrictMode: false,
}
