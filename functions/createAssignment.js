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
            q.Create(q.Collection('AssignmentStudent'), {
              data: {
                assignment: q.Select('ref', q.Var('assignment')),
                student: q.Ref(q.Collection('User'), q.Var('id')),
              },
            })
          )
        ),
        // Merge assignment with additional needed fields for UI cards
        assignment: q.Merge(q.Select('data', q.Var('assignment')), {
          id: q.Select(['ref', 'id'], q.Var('assignment')),
          numStudents: q.Count(
            q.Match(
              q.Index('assignment_students'),
              q.Select('ref', q.Var('assignment'))
            )
          ),
          numQuestions: q.Count(
            q.Select(['data', 'questions'], q.Var('assignment'))
          ),
          live: q.If(
            q.LT(
              q.ToDate(
                // Old assignments include a time which ToDate
                // won't be able to parse so chop it off
                q.SubString(
                  q.Select(['data', 'dateDue'], q.Var('assignment')),
                  0,
                  10
                )
              ),
              q.ToDate(q.Now())
            ),
            false,
            true
          ),
          group: q.Let(
            {
              instance: q.Get(q.Select(['data', 'group'], q.Var('assignment'))),
            },
            {
              id: q.Select(['ref', 'id'], q.Var('instance')),
              name: q.Select(['data', 'name'], q.Var('instance')),
            }
          ),
        }),
      }
    )
    const response = await keyedClient.query(qry)
    // console.log(response.assignment)
    return {
      statusCode: 200,
      body: JSON.stringify(response.assignment),
    }
  } catch (err) {
    console.error(err.description)
    return { statusCode: 500, body: JSON.stringify(err) }
  }
}
