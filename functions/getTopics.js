const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event, context, callback) => {
  const data = JSON.parse(event.body)
  const courseId = data.courseId
  // Configure client using user's secret token
  const keyedClient = new faunadb.Client({
    secret: data.secret,
  })
  console.log(`DEBUG => ID is ${courseId}`)
  try {
    const q2 = q.Select('data', q.Get(q.Ref(q.Collection('Course'), courseId)))
    // const qry = q.Select(
    //   'data',
    //   q.Map(
    //     q.Paginate(
    //       q.Match(
    //         q.Index('course_topics'),
    //         q.Ref(q.Collection('Course'), courseId)
    //       )
    //     ),
    //     q.Lambda(
    //       'tRef',
    //       q.Let(
    //         {
    //           instance: q.Get(q.Var('tRef')), // Topic
    //         },
    //         {
    //           id: q.Select(['ref', 'id'], q.Var('instance')),
    //           name: q.Select(['data', 'name'], q.Var('instance')),
    //           count: q.Count(
    //             q.Match(q.Index('topic_questions'), q.Var('tRef'))
    //           ),
    //           // If this is a student, also get the number of
    //           // independent revision questions done in topic
    //           // answered: q.If(
    //           //   q.Equals(includeAnswered, true),
    //           //   q.Count(
    //           //     q.Match(
    //           //       q.Index('response_by_student_topic'),
    //           //       q.CurrentIdentity(),
    //           //       q.Select('ref', q.Var('instance'))
    //           //     )
    //           //   ),
    //           //   ''
    //           // ),
    //         }
    //       )
    //     )
    //   )
    // )
    const data = await keyedClient.query(q2)
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
