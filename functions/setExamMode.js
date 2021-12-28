const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event) => {
  const data = JSON.parse(event.body)
  const studentId = data.studentId
  const examMode = data.examMode
  const secret = data.secret
  // Configure client using user's secret token
  const keyedClient = new faunadb.Client({
    secret,
  })
  try {
    const qry = q.Update(q.Ref(q.Collection('User'), studentId), {
      data: {
        examMode,
      },
    })
    await keyedClient.query(qry)
    return {
      statusCode: 200,
    }
  } catch (err) {
    console.error(err.description)
    return { statusCode: 500, body: JSON.stringify(err) }
  }
}
