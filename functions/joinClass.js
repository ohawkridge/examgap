const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event) => {
  const data = JSON.parse(event.body)
  const code = data.code
  const secret = data.secret
  // Configure client using user's secret token
  const keyedClient = new faunadb.Client({
    secret,
  })
  try {
    const qry = q.Let(
      {
        group: q.Select(
          'ref',
          q.Get(q.Match(q.Index('group_by_code'), q.ReplaceStr(code, '-', '')))
        ),
      },
      {
        res: q.Do(
          // Create mapping doc in GroupStudent
          q.Create(q.Collection('GroupStudent'), {
            data: {
              student: q.CurrentIdentity(),
              group: q.Var('group'),
            },
          }),
          // For each existing assignment for group
          // create mapping in AssignmentStudent
          q.Foreach(
            q.Paginate(q.Match(q.Index('group_assignments'), q.Var('group')), {
              size: 999,
            }),
            q.Lambda(
              'ref',
              q.Create(q.Collection('AssignmentStudent'), {
                data: {
                  assignment: q.Var('ref'),
                  student: q.CurrentIdentity(),
                },
              })
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
    return { statusCode: 500, body: err.toString() }
  }
}
