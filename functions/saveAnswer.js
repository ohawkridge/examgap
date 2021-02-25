const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event, context, callback) => {
  const data = JSON.parse(event.body)
  const assignmentId = data.assignmentId
  const questionId = data.questionId
  const text = data.text
  const topicId = data.topicId
  // Configure client using user's secret token
  const keyedClient = new faunadb.Client({
    secret: data.secret,
  })
  try {
    const qry = q.Create(q.Collection('Response'), {
      data: {
        text,
        feedback: '',
        marked: false,
        repeat: false,
        flagged: false,
        student: q.CurrentIdentity(),
        question: q.Ref(q.Collection('Question'), questionId),
        // Save topic for independent revision questions
        topic: q.Ref(q.Collection('Topic'), topicId),
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
      },
    })
    const data = await keyedClient.query(qry)
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
