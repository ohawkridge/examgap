const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event, context, callback) => {
  const data = JSON.parse(event.body)
  const name = data.name
  const start = data.start
  const dateDue = data.end
  const group = data.group
  const students = data.students
  const questions = data.questions
  // Configure client using user's secret token
  const keyedClient = new faunadb.Client({
    secret: data.secret,
  })
  try {
    // Create the assignment
    let qry = q.Create(q.Collection('Assignment'), {
      data: {
        name,
        start,
        dateDue,
        questions,
        group: q.Ref(q.Collection('Group'), group),
        teacher: q.CurrentIdentity(),
      },
    })
    const assignment = await keyedClient.query(qry)

    // Use the new assignment's ref, create mappings
    // in AssignmentStudent for selected students
    qry = q.Map(
      students,
      q.Lambda(
        'id',
        q.Do(
          // Create doc in AssignmentStudent
          q.Create(q.Collection('AssignmentStudent'), {
            data: {
              assignment: assignment.ref,
              student: q.Ref(q.Collection('User'), q.Var('id')),
            },
          }),
          // Update student's user doc with the new assignment id
          // (Document streaming watches this for new assignments)
          q.Update(q.Ref(q.Collection('User'), q.Var('id')), {
            data: {
              newAssignment: assignment.ref.id,
            },
          })
        )
      )
    )
    await keyedClient.query(qry)
    return {
      statusCode: 200,
      body: JSON.stringify(assignment),
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
