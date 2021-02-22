const faunadb = require('faunadb')

// Create an instance of the faunadb client. If secret is provided,
// client will have the privileges associated with that key. If no
// secret is provided, one is fetched via a lambda function from
// an environment variable in Netlify.
// export default async function createClient(secret = null) {
export default async function createClient(secret = null) {
  if (secret) {
    console.log('IM NEVER CALLED')
    return new faunadb.Client({ secret })
  } else {
    // Object like: {"faunaSecret":"fnA009I5plAJh7hEEqQ8EFBBJg41ZjsDDAJqPPl8"}
    // N.B. Following update to netlify-cli v.x.57 this must be absolute URL
    const response = await fetch('/.netlify/functions/getServerSecret')
    // console.log(`Lambda function called`);
    const { faunaSecret } = await response.json() // Destructuring assignment
    return new faunadb.Client({ secret: faunaSecret })
  }
}
