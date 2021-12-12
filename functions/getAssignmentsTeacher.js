const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event) => {
  const data = JSON.parse(event.body)
  const groupId = data.groupId
  const secret = data.secret
  // Configure client using user's secret token
  const keyedClient = new faunadb.Client({
    secret,
  })
  try {
    const qry = q.Select(
      'data',
      q.Map(
        q.Paginate(
          q.Match(
            q.Index('group_assignments'),
            q.Ref(q.Collection('Group'), groupId)
          )
        ),
        q.Lambda(
          'ref',
          q.Let(
            {
              instance: q.Get(q.Var('ref')), // Assignment
            },
            {
              id: q.Select(['ref', 'id'], q.Var('instance')),
              name: q.Select(['data', 'name'], q.Var('instance')),
              start: q.Select(['data', 'start'], q.Var('instance'), 'N/A'),
              dateDue: q.Select(['data', 'dateDue'], q.Var('instance')),
              numQuestions: q.Count(
                q.Select(['data', 'questions'], q.Var('instance'))
              ),
              numStudents: q.Count(
                q.Match(
                  q.Index('assignment_students'),
                  q.Select('ref', q.Var('instance'))
                )
              ),
              live: q.LT(
                q.ToDate(
                  q.SubString(
                    q.Select(['data', 'dateDue'], q.Var('instance')),
                    0,
                    10
                  )
                ),
                q.ToDate(q.Now())
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
