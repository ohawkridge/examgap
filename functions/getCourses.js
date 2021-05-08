const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event, context, callback) => {
  const data = JSON.parse(event.body)
  // Configure client using user's secret token
  const keyedClient = new faunadb.Client({
    secret: data.secret,
  })
  try {
    const qry = q.Select(
      'data',
      q.Map(
        q.Paginate(q.Documents(q.Collection('Course'))),
        q.Lambda(
          'ref',
          q.Let(
            {
              instance: q.Get(q.Var('ref')), // Course
            },
            {
              id: q.Select(['ref', 'id'], q.Var('instance')),
              name: q.Select(['data', 'shortName'], q.Var('instance')),
              board: q.Select(['data', 'board'], q.Var('instance')),
              cat: q.Select(['data', 'cat'], q.Var('instance')),
            }
          )
        )
      )
    )
    const data = await keyedClient.query(qry)
    // Organise courses into categories
    // GCSE
    const out = [{ header: 'GCSE COURSES' }, { divider: true }]
    for (const course of data) {
      if (course.cat === 'GCSE') {
        out.push(course)
      }
    }
    // A level
    out.push({ header: 'A LEVEL COURSES' }, { divider: true })
    for (const course of data) {
      if (course.cat === 'A2') {
        out.push(course)
      }
    }
    // IT
    out.push({ header: 'IT COURSES' }, { divider: true })
    for (const course of data) {
      if (course.cat === 'IT') {
        out.push(course)
      }
    }
    return {
      statusCode: 200,
      body: JSON.stringify(out),
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
