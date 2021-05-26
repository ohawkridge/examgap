const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event, context, callback) => {
  const data = JSON.parse(event.body)
  const responseId = data.responseId
  const marks = data.marks
  // Configure client using user's secret token
  const keyedClient = new faunadb.Client({
    secret: data.secret,
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
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
