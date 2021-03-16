const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event, context, callback) => {
  const data = JSON.parse(event.body)
  const groupId = data.groupId
  // Configure client using user's secret token
  const keyedClient = new faunadb.Client({
    secret: data.secret,
  })
  try {
    const qry = q.Select(
      'data',
      q.Reverse(
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
              }
            )
          )
        )
      )
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
