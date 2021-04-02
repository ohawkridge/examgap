const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event, context, callback) => {
  const data = JSON.parse(event.body)
  const name = data.groupName
  const courseId = data.courseId
  // Configure client using user's secret token
  const keyedClient = new faunadb.Client({
    secret: data.secret,
  })
  try {
    // First, get a code from the Code collection
    const qry1 = q.Get(
      q.Select(
        0,
        q.Select(
          'data',
          q.Take(1, q.Paginate(q.Documents(q.Collection('Code'))))
        )
      )
    )
    const codeDoc = await keyedClient.query(qry1)

    // Now create class and customise returned data structure
    const qry2 = q.Let(
      {
        instance: q.Create(q.Collection('Group'), {
          data: {
            name,
            active: true,
            teacher: q.CurrentIdentity(),
            course: q.Ref(q.Collection('Course'), courseId),
            code: q.Select(['data', 'code'], codeDoc),
          },
        }),
      },
      {
        id: q.Select(['ref', 'id'], q.Var('instance')),
        name: q.Select(['data', 'name'], q.Var('instance')),
        active: q.Select(['data', 'active'], q.Var('instance')),
        code: q.Select(['data', 'code'], q.Var('instance')),
        num_students: 0,
        course: q.Let(
          {
            instance: q.Get(q.Select(['data', 'course'], q.Var('instance'))),
          },
          {
            board: q.Select(['data', 'board'], q.Var('instance')),
            id: q.Select(['ref', 'id'], q.Var('instance')),
            name: q.Select(['data', 'name'], q.Var('instance')),
            qan: q.Select(['data', 'qan'], q.Var('instance')),
          }
        ),
        assignments: [],
      }
    )
    const newGroup = await keyedClient.query(qry2)

    // Delete code so it can't be used again
    const qry3 = q.Delete(q.Select('ref', codeDoc))
    await keyedClient.query(qry3)

    return {
      statusCode: 200,
      body: JSON.stringify(newGroup),
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
