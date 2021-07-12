const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event, context, callback) => {
  const data = JSON.parse(event.body)
  const responseId = data.responseId
  const marks = data.markIds
  const secret = data.secret
  // Configure client using user's secret token
  const keyedClient = new faunadb.Client({
    secret,
  })
  try {
    const qry = q.Map(
      marks,
      q.Lambda(
        'mId',
        q.Create(q.Collection('SelfMark'), {
          data: {
            response: q.Ref(q.Collection('Response'), responseId),
            mark: q.Ref(q.Collection('Mark'), q.Var('mId')),
          },
        })
      )
    )
    const data = await keyedClient.query(qry)
    console.log(data)
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    }
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify(err) }
  }
}
