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
      q.Filter(
        q.Map(
          q.Paginate(
            q.Match(q.Index('student_assignments'), q.CurrentIdentity())
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
                group: q.Let(
                  {
                    instance: q.Get(
                      q.Select(['data', 'group'], q.Var('instance')) // Group
                    ),
                  },
                  {
                    id: q.Select(['ref', 'id'], q.Var('instance')),
                    name: q.Select(['data', 'name'], q.Var('instance')),
                  }
                ),
              }
            )
          )
        ),
        q.Lambda(
          'ref',
          q.LTE(
            q.ToDate(q.Now()),
            q.ToDate(q.SubString(q.Select('dateDue', q.Var('ref')), 0, 10))
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
