const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event) => {
  const data = JSON.parse(event.body)
  const name = data.name
  const start = data.start
  const dateDue = data.end
  const group = data.group
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
            group: q.Ref(q.Collection('Group'), group),
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
            q.Do(
              // Create doc in AssignmentStudent
              q.Create(q.Collection('AssignmentStudent'), {
                data: {
                  assignment: q.Select('ref', q.Var('assignment')),
                  student: q.Ref(q.Collection('User'), q.Var('id')),
                },
              }),
              // TODO Won't need this?
              // Update student's user doc with the new assignment id
              // (Document streaming watches this for new assignments)
              q.Update(q.Ref(q.Collection('User'), q.Var('id')), {
                data: {
                  newAssignment: q.Select(['ref', 'id'], q.Var('assignment')),
                },
              })
            )
          )
        ),
        assignment: q.Var('assignment'),
      }
    )
    const response = await keyedClient.query(qry)
    // console.log(response)
    return {
      statusCode: 200,
      body: JSON.stringify(response.assignment),
    }
  } catch (err) {
    console.error(err.description)
    return { statusCode: 500, body: JSON.stringify(err) }
  }
}
