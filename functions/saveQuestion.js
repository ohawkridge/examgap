const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event, context, callback) => {
  const data = JSON.parse(event.body)

  // Build the object here so we can reuse it
  const questionObj = {
    text: data.question.text,
    maxMark: data.question.maxMark,
    modelAnswer: data.question.modelAnswer,
    keywords: data.question.keywords,
    minWords: minWords(data.question.modelAnswer),
    guidance: data.question.guidance,
  }

  // Configure client using user's secret token
  const keyedClient = new faunadb.Client({
    secret: data.secret,
  })
  try {
    const qry = q.Let(
      {
        // First create/update the question
        instance: q.If(
          q.Equals(data.edit, true),
          // Update existing question document
          // N.B. You can't use dot syntax inside FQL anymore!?
          q.Update(
            q.Ref(q.Collection('Question'), q.Select(['question', 'id'], data)),
            {
              data: questionObj,
            }
          ),
          // Create new question docment
          q.Create(q.Collection('Question'), {
            data: questionObj,
          })
        ),
      },
      {
        marks: q.Do(
          // Delete all existing topic mappings
          q.Map(
            q.Paginate(
              q.Match(
                q.Index('question_topics_maps'),
                q.Select('ref', q.Var('instance'))
              )
            ),
            q.Lambda('ref', q.Delete(q.Var('ref')))
          ),
          // Create new mappings
          q.Map(
            q.Select(['question', 'selectedTopics'], data),
            q.Lambda(
              'ref',
              q.Create(q.Collection('TopicQuestion'), {
                data: {
                  question: q.Select('ref', q.Var('instance')),
                  topic: q.Ref(q.Collection('Topic'), q.Var('ref')),
                },
              })
            )
          ),
          // Update text for marks + create any new marks
          // NEVER delete marks!! (could be awarded to existing responses)
          q.Foreach(
            // marks are objects like { id: '', text: '' }
            q.Select(['question', 'marks'], data),
            q.Lambda(
              'obj',
              q.If(
                q.Equals(q.Select('id', q.Var('obj')), ''),
                // Create a new mark
                // (New marks don't have an ID yet)
                q.Create(q.Collection('Mark'), {
                  data: {
                    text: q.Select('text', q.Var('obj')),
                    question: q.Select('ref', q.Var('instance')), // Question above
                  },
                }),
                // Update an existing mark
                q.Update(
                  q.Ref(q.Collection('Mark'), q.Select('id', q.Var('obj'))),
                  {
                    data: {
                      text: q.Select('text', q.Var('obj')),
                    },
                  }
                )
              )
            )
          )
        ),
        // We need to return the question id
        id: q.Select(['ref', 'id'], q.Var('instance')),
      }
    )
    const res = await keyedClient.query(qry)
    return {
      statusCode: 200,
      body: JSON.stringify(res),
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}

// Calculate 10% less than the word count of model answer
function minWords(text) {
  return String(
    Math.round(text.trim().replace(/\s+/gi, ' ').split(' ').length * 0.9)
  )
}
