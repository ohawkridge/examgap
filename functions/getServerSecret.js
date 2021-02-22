// https://github.com/shortdiv/got-lobstah/blob/master/functions/fauna-user/fauna-user.js
exports.handler = () => {
  try {
    // Server secret environment var set in Netlify UI
    const faunaSecret = process.env.SECRET_KEY
    return {
      statusCode: 200,
      body: JSON.stringify({ faunaSecret }),
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
