const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event) => {
  const data = JSON.parse(event.body)
  const courseId = data.courseId
  const secret = data.secret
  console.log('courseId', courseId)
  // Configure client using user's secret token
  const keyedClient = new faunadb.Client({
    secret,
  })
  try {
    const qry = q.Select(
      'data',
      q.Map(
        q.Paginate(
          q.Match(
            q.Index('course_topics'),
            q.Ref(q.Collection('Course'), courseId)
          )
        ),
        q.Lambda(
          'ref',
          q.Let(
            {
              instance: q.Get(q.Var('ref')), // Topic
            },
            {
              id: q.Select(['ref', 'id'], q.Var('instance')),
              name: q.Select(['data', 'name'], q.Var('instance')),
              numQuestions: q.Count(
                q.Match(q.Index('topic_questions'), q.Var('ref'))
              ),
              // 'response_by_student_topic' only finds
              // responses where a topic Ref is set
              numAnswered: q.Count(
                q.Match(
                  q.Index('response_by_student_topic'),
                  q.CurrentIdentity(),
                  q.Select('ref', q.Var('instance'))
                )
              ),
            }
          )
        )
      )
    )
    const data = await keyedClient.query(qry)
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
