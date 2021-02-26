const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event, context, callback) => {
  const data = JSON.parse(event.body)
  const assignmentId = data.assignmentId
  // Configure client using user's secret token
  const keyedClient = new faunadb.Client({
    secret: data.secret,
  })
  try {
    const qry = q.Let(
      {
        instance: q.Get(q.Ref(q.Collection('Assignment'), assignmentId)),
      },
      {
        id: q.Select(['ref', 'id'], q.Var('instance')),
        name: q.Select(['data', 'name'], q.Var('instance')),
        start: q.Select(['data', 'start'], q.Var('instance')),
        dateDue: q.Select(['data', 'dateDue'], q.Var('instance')),
        questions: q.Select(['data', 'questions'], q.Var('instance')),
        group: q.Select('id', q.Select(['data', 'group'], q.Var('instance'))),
        live: q.TimeDiff(
          q.ToDate(q.Now()),
          q.Date(
            q.SubString(q.Select(['data', 'dateDue'], q.Var('instance')), 0, 10)
          ),
          'days'
        ),
      }
    )
    const data = await keyedClient.query(qry)
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
