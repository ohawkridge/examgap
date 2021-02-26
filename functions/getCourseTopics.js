const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event, context, callback) => {
  const data = JSON.parse(event.body)
  const courseIds = data.courseIds
  // Configure client using user's secret token
  const keyedClient = new faunadb.Client({
    secret: data.secret,
  })
  try {
    const qry = q.Map(
      courseIds,
      q.Lambda(
        'ref',
        q.Let(
          {
            instance: q.Get(q.Ref(q.Collection('Course'), q.Var('ref'))), // Course
          },
          {
            id: q.Select(['ref', 'id'], q.Var('instance')),
            course: q.Select(['data', 'name'], q.Var('instance')),
            board: q.Select(['data', 'board'], q.Var('instance')),
            topics: q.Select(
              ['data'],
              q.Map(
                q.Paginate(
                  q.Match(
                    q.Index('course_topics'),
                    q.Select(['ref'], q.Var('instance'))
                  )
                ),
                q.Lambda(
                  'tRef',
                  q.Let(
                    {
                      instance: q.Get(q.Var('tRef')), // Topic
                    },
                    {
                      id: q.Select(['ref', 'id'], q.Var('instance')),
                      name: q.Select(['data', 'name'], q.Var('instance')),
                    }
                  )
                )
              )
            ),
          }
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
