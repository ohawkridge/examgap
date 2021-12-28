const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event) => {
  const data = JSON.parse(event.body)
  const name = data.name
  const start = data.start
  const dateDue = data.end
  const groupId = data.groupId
  const students = data.students
  const questions = data.questions
  const secret = data.secret
  // Configure client using user's secret token
  const keyedClient = new faunadb.Client({
    secret,
  })
  try {
    const qry = q.Let(
      {
        // Create assignment
        assignment: q.Create(q.Collection('Assignment'), {
          data: {
            name,
            start,
            dateDue,
            questions,
            group: q.Ref(q.Collection('Group'), groupId),
            teacher: q.CurrentIdentity(),
          },
        }),
      },
      {
        // Create docs in AssignmentStudent for selected students
        maps: q.Map(
          students,
          q.Lambda(
            'id',
            q.Create(q.Collection('AssignmentStudent'), {
              data: {
                assignment: q.Select('ref', q.Var('assignment')),
                student: q.Ref(q.Collection('User'), q.Var('id')),
              },
            })
          )
        ),
      }
    )
    const data = await keyedClient.query(qry)
    console.log(data)
    return {
      statusCode: 200,
    }
  } catch (err) {
    console.error(err.description)
    return { statusCode: 500, body: JSON.stringify(err) }
  }
}
