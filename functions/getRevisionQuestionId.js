const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event) => {
  const data = JSON.parse(event.body)
  const topicId = data.topicId
  const answered = data.answered
  const secret = data.secret
  console.log(answered)
  // Configure client using user's secret token
  const keyedClient = new faunadb.Client({
    secret,
  })
  try {
    const qry = q.Select(
      'data',
      q.Map(
        q.Paginate(
          q.Match(
            q.Index('topic_questions'),
            q.Ref(q.Collection('Topic'), topicId)
          ),
          { size: 128 } // In case a topic has >64 questions
        ),
        q.Lambda('ref', q.Select(['id'], q.Var('ref')))
      )
    )
    const listOfIds = await keyedClient.query(qry)
    // Topic has no questions
    if (listOfIds.length === 0) {
      return { statusCode: 404 }
    }
    return {
      statusCode: 200,
      // Use the student's count of answered questions
      // as an index into the array of question ids
      body: JSON.stringify(listOfIds)[answered],
    }
  } catch (err) {
    console.error(err.description)
    return { statusCode: 500, body: JSON.stringify(err) }
  }
}
