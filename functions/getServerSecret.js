// https://github.com/shortdiv/got-lobstah/blob/master/functions/fauna-user/fauna-user.js
exports.handler = () => {
  try {
    // Get LoginKey2 from environment variable at Netlify
    const faunaSecret = process.env.SECRET_KEY
    return {
      statusCode: 200,
      body: JSON.stringify({ faunaSecret }),
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
