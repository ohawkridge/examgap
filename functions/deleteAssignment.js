const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event) => {
  const data = JSON.parse(event.body)
  const assignmentId = data.assignmentId
  const secret = data.secret
  // Configure client using user's secret token
  const keyedClient = new faunadb.Client({
    secret,
  })
  try {
    const qry = q.Do(
      // Delete the actual assignment
      q.Delete(q.Ref(q.Collection('Assignment'), assignmentId)),
      // Delete mappings in AssignmentStudents
      q.Map(
        q.Paginate(
          q.Match(
            q.Index('delete_assignment_students'),
            q.Ref(q.Collection('Assignment'), assignmentId)
          )
        ),
        q.Lambda('ref', q.Delete(q.Var('ref')))
      ),
      // Delete student responses and marks
      q.Map(
        q.Paginate(
          q.Match(
            q.Index('assignment_responses'),
            q.Ref(q.Collection('Assignment'), assignmentId)
          )
        ),
        q.Lambda(
          'ref',
          q.Do(
            // Delete TeacherMark documents
            q.Map(
              q.Paginate(
                q.Match(
                  q.Index('delete_assignment_teacher_marks'),
                  q.Var('ref')
                )
              ),
              q.Lambda('tmRef', q.Delete(q.Var('tmRef')))
            ),
            // Delete SelfMark documents
            q.Map(
              q.Paginate(
                q.Match(q.Index('delete_assignment_self_marks'), q.Var('ref'))
              ),
              q.Lambda('smRef', q.Delete(q.Var('smRef')))
            ),
            // Delete the response itself
            q.Delete(q.Var('ref'))
          )
        )
      )
    )
    await keyedClient.query(qry)
    return {
      statusCode: 200,
    }
  } catch (err) {
    console.error(err.description)
    return { statusCode: 500, body: JSON.stringify(err) }
  }
}
