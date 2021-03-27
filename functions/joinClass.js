const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event, context, callback) => {
  const data = JSON.parse(event.body)
  const code = data.code
  console.log(`Join w/ code: ${code}`)
  // Configure client using user's secret token
  const keyedClient = new faunadb.Client({
    secret: data.secret,
  })
  try {
    const qry = q.Create(
      q.Ref(q.Collection('GroupStudent'), {
        data: {
          student: q.CurrentIdentity(),
          group: q.Get(q.Match(q.Index('group_by_code'), code)),
        },
      })
    )
    const data = await keyedClient.query(qry)
    console.log(data)
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
