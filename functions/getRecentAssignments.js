const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event) => {
  const data = JSON.parse(event.body)
  const teacherId = data.teacherId
  const secret = data.secret
  // Configure client using user's secret token
  const keyedClient = new faunadb.Client({
    secret,
  })
  try {
    const qry = q.Select(
      'data',
      q.Map(
        q.Take(
          5,
          q.Reverse(
            q.Paginate(
              q.Match(
                q.Index('teacher_assignments'),
                q.Ref(q.Collection('User'), teacherId)
              ),
              { size: 999 }
            )
          )
        ),
        q.Lambda(
          'ref',
          q.Let(
            {
              instance: q.Get(q.Var('ref')),
            },
            {
              id: q.Select(['ref', 'id'], q.Var('instance')),
              name: q.Select(['data', 'name'], q.Var('instance')),
              start: q.Select(['data', 'start'], q.Var('instance')),
              dueDate: q.Select(['data', 'dateDue'], q.Var('instance')),
              group: q.Select(
                ['data', 'name'],
                q.Get(q.Select(['data', 'group'], q.Var('instance')))
              ),
              count: q.Count(
                q.Match(
                  q.Index('assignment_students'),
                  q.Select(['ref'], q.Var('instance'))
                )
              ),
              numQuestions: q.Count(
                q.Select(['data', 'questions'], q.Var('instance'))
              ),
            }
          )
        )
      )
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
