const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event, context, callback) => {
  const data = JSON.parse(event.body)
  const groupName = data.groupName
  const courseId = data.courseId
  // Configure client using user's secret token
  const keyedClient = new faunadb.Client({
    secret: data.secret,
  })
  try {
    const qry = q.Let(
      {
        createdGroup: q.Create(q.Collection('Group'), {
          data: {
            name: groupName,
            active: true,
            teacher: q.CurrentIdentity(),
            course: q.Ref(q.Collection('Course'), courseId),
          },
        }),
      },
      {
        // Customise returned data to match
        // existing groups already in store
        active: q.Select(['data', 'active'], q.Var('createdGroup')),
        assignments: [],
        num_students: 0,
        course: q.Let(
          {
            instance: q.Get(
              q.Select(['data', 'course'], q.Var('createdGroup'))
            ), // Course
          },
          {
            board: q.Select(['data', 'board'], q.Var('instance')),
            colour: q.Select(['data', 'colour'], q.Var('instance')),
            id: q.Select(['ref', 'id'], q.Var('instance')),
            name: q.Select(['data', 'name'], q.Var('instance')),
            qan: q.Select(['data', 'qan'], q.Var('instance')),
          }
        ),
        id: q.Select(['ref', 'id'], q.Var('createdGroup')),
        name: q.Select(['data', 'name'], q.Var('createdGroup')),
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
