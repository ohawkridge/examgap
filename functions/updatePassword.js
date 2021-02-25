const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event, context, callback) => {
  const data = JSON.parse(event.body)
  const oldPass = data.oldPass
  const newPass = data.newPass
  // Configure client using user's secret token
  const keyedClient = new faunadb.Client({
    secret: data.secret,
  })
  try {
    const qry = q.If(
      q.Identify(q.CurrentIdentity(), oldPass),
      q.Update(q.CurrentIdentity(), {
        credentials: {
          password: newPass,
        },
      }),
      false
    )
    const data = await keyedClient.query(qry)
    console.log(`DB returned`)
    console.dir(data)
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
