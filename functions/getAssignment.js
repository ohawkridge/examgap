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
    const qry = q.Let(
      {
        instance: q.Get(q.Ref(q.Collection('Assignment'), assignmentId)), // Assignment
      },
      {
        id: q.Select(['ref', 'id'], q.Var('instance')),
        name: q.Select(['data', 'name'], q.Var('instance')),
        start: q.Select(['data', 'start'], q.Var('instance'), 'N/A'),
        dateDue: q.Select(['data', 'dateDue'], q.Var('instance')),
        questions: q.Map(
          q.Select(['data', 'questions'], q.Var('instance')),
          q.Lambda(
            'qId',
            q.Let(
              {
                instance: q.Get(q.Ref(q.Collection('Question'), q.Var('qId'))), // Question
              },
              {
                id: q.Var('qId'),
                text: q.Select(['data', 'text'], q.Var('instance')),
                maxMark: q.Select(['data', 'maxMark'], q.Var('instance')),
                // *Questions will only have one response*
                // Get returns the first from match but errors if not found
                response: q.If(
                  q.Exists(
                    q.Match(q.Index('question_responses'), [
                      q.CurrentIdentity(), // Student
                      q.Select('ref', q.Var('instance')), // Question
                      q.Ref(q.Collection('Assignment'), assignmentId), // Assignment
                    ])
                  ),
                  q.Let(
                    {
                      instnc: q.Get(
                        q.Match(q.Index('question_responses'), [
                          q.CurrentIdentity(),
                          q.Select('ref', q.Var('instance')),
                          q.Ref(q.Collection('Assignment'), assignmentId),
                        ])
                      ),
                    },
                    {
                      id: q.Select(['ref', 'id'], q.Var('instnc')),
                      text: q.Select(['data', 'text'], q.Var('instnc')),
                      marked: q.Select(['data', 'marked'], q.Var('instnc')),
                      repeat: q.Select(['data', 'repeat'], q.Var('instnc')),
                      feedback: q.Select(
                        ['data', 'feedback'],
                        q.Var('instnc'),
                        ''
                      ),
                      // Count marks
                      tm: q.Call(q.Function('TeacherMarks'), q.Var('instnc')),
                      sm: q.Call(q.Function('SelfMarks'), q.Var('instnc')),
                    }
                  ),
                  ''
                ),
              }
            )
          )
        ),
      }
    )
    const data = await keyedClient.query(qry)
    console.log(data)
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    }
  } catch (err) {
    console.error(err.description)
    return { statusCode: 500, body: JSON.stringify(err) }
  }
}
