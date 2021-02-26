const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event, context, callback) => {
  const data = JSON.parse(event.body)
  const topicId = data.topicId
  const answered = data.answered
  // Configure client using user's secret token
  const keyedClient = new faunadb.Client({
    secret: data.secret,
  })
  try {
    const qry = q.Select(
      'data',
      q.Map(
        q.Paginate(
          q.Match(
            q.Index('topic_questions'),
            q.Ref(q.Collection('Topic'), topicId)
          )
        ),
        q.Lambda('ref', q.Select(['id'], q.Var('ref')))
      )
    )
    const data = await keyedClient.query(qry)
    // Topic might not have any questions
    // In which case, array access below will crash
    if (data.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify(''),
      }
    }
    // From all questions return the next question
    // to revise using the student's count of answered
    // questions as an index into the arry of questions
    return {
      statusCode: 200,
      body: JSON.stringify(data[answered]),
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
