const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event) => {
  const data = JSON.parse(event.body)
  const secret = data.secret
  const client = new faunadb.Client({
    secret,
  })
  try {
    const qry = q.Select(
      'data',
      q.Map(
        q.Paginate(
          q.Match(q.Index('teacher_groups_3'), q.CurrentIdentity(), false)
        ),
        q.Lambda(
          'ref',
          q.Let(
            {
              instance: q.Get(q.Var('ref')), // Group
            },
            {
              id: q.Select(['id'], q.Var('ref')),
              name: q.Select(['data', 'name'], q.Var('instance')),
              active: q.Select(['data', 'active'], q.Var('instance')),
              code: q.Select(['data', 'code'], q.Var('instance')),
              numStudents: q.Count(
                q.Match(
                  q.Index('group_students'),
                  q.Select('ref', q.Var('instance'))
                )
              ),
              course: q.Call(
                q.Function('GetCourse'),
                q.Select(['data', 'course'], q.Var('instance'))
              ),
            }
          )
        )
      )
    )
    const data = await client.query(qry)
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
