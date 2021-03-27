const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event, context, callback) => {
  const data = JSON.parse(event.body)
  const assignmentId = data.assignmentId
  const questionId = data.questionId
  const text = data.text
  const topicId = data.topicId
  const responseId = data.responseId
  // Configure client using user's secret token
  const keyedClient = new faunadb.Client({
    secret: data.secret,
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
          // Save topic for independent revision questions
          topic: topicId === '' ? 0 : q.Ref(q.Collection('Topic'), topicId),
          // Independent revision has no assignment id
          assignment:
            assignmentId === 0
              ? ''
              : q.Ref(q.Collection('Assignment'), assignmentId),
          // Need group to filter data by class later on
          group:
            assignmentId === 0
              ? ''
              : q.Select(
                  ['data', 'group'],
                  q.Get(q.Ref(q.Collection('Assignment'), assignmentId))
                ),
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
    return { statusCode: 500, body: err.toString() }
  }
}
