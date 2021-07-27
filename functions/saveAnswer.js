const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event) => {
  const data = JSON.parse(event.body)
  const assignmentId = data.assignmentId
  const questionId = data.questionId
  const text = data.text
  const topicId = data.topicId
  const responseId = data.responseId
  const groupId = data.groupId
  const secret = data.secret
  // Configure client using user's secret token
  const keyedClient = new faunadb.Client({
    secret,
  })
  try {
    const qry = q.If(
      // If no responseId is provided, create a new response
      q.Equals(responseId, ''),
      q.Create(q.Collection('Response'), {
        data: {
          text,
          feedback: '',
          marked: false,
          repeat: false,
          flagged: false,
          student: q.CurrentIdentity(),
          question: q.Ref(q.Collection('Question'), questionId),
          topic: q.If(
            q.Equals(topicId, ''),
            '',
            q.Ref(q.Collection('Topic'), topicId)
          ),
          // Independent revision—no assignment id
          assignment: q.If(
            q.Equals(assignmentId, 0),
            '',
            q.Ref(q.Collection('Assignment'), assignmentId)
          ),
          group: q.Ref(q.Collection('Assignment'), groupId),
          startTime: q.Now(),
          timeTaken: 0,
        },
      }),
      // Otherwise, update text of existing response
      q.Update(q.Ref(q.Collection('Response'), responseId), {
        data: {
          text,
          timeTaken: q.TimeDiff(
            q.Select(
              ['data', 'startTime'],
              q.Get(q.Ref(q.Collection('Response'), responseId))
            ),
            q.Now(),
            'seconds'
          ),
        },
      })
    )
    const data = await keyedClient.query(qry)
    return {
      statusCode: 200,
      body: JSON.stringify(data.ref.id),
    }
  } catch (err) {
    console.error(err.description)
    return { statusCode: 500, body: JSON.stringify(err) }
  }
}
