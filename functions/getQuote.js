const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event) => {
  const data = JSON.parse(event.body)
  const secret = data.secret
  // Configure client using user's secret token
  const keyedClient = new faunadb.Client({
    secret,
  })
  try {
    const n = Math.floor(Math.random() * 1252)
    const qry = q.Select('data', q.Get(q.Match(q.Index('quote_by_sort'), n)))
    const data = await keyedClient.query(qry)
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    }
  } catch (err) {
    console.error(err.description)
    return { statusCode: 500, body: JSON.stringify(err) }
  }
}
