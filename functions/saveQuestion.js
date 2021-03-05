const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = async (event, context, callback) => {
  const data = JSON.parse(event.body)
  const edit = data.edit
  const questionId = data.question.id
  const selectedTopics = data.question.selectedTopics
  const marks = data.question.marks
  const questionObj = {
    text: data.question.text,
    modelAnswer: data.question.modelAnswer,
    keywords: data.question.keywords,
    maxMark: data.question.maxMark,
    minWords: minWords(data.question.text),
    guidance: data.question.guidance,
  }
  // Configure client using user's secret token
  const keyedClient = new faunadb.Client({
    secret: data.secret,
  })
  try {
    // First create/update the question
    let qry = q.If(
      q.Equals(edit, true),
      // Update existing question document
      q.Update(q.Ref(q.Collection('Question'), questionId), {
        data: questionObj,
      }),
      // Create new question docment
      q.Create(q.Collection('Question'), {
        data: questionObj,
      })
    )
    const data = await keyedClient.query(qry)

    // Second query to handle everything else
    qry = q.Do(
      // Delete existing topic mappings
      q.Map(
        q.Paginate(q.Match(q.Index('question_topics_maps'), data.ref)),
        q.Lambda('ref', q.Delete(q.Var('ref')))
      ),
      // Create new mappings
      q.Map(
        selectedTopics,
        q.Lambda(
          'ref',
          q.Create(q.Collection('TopicQuestion'), {
            data: {
              question: data.ref,
              topic: q.Ref(q.Collection('Topic'), q.Var('ref')),
            },
          })
        )
      ),
      // Update text for marks + create any new marks
      // NEVER delete marks!! (could be awarded to existing responses)
      q.Foreach(
        marks,
        q.Lambda(
          'ref2',
          q.If(
            q.Equals(q.Var('ref2').id, ''),
            // Create a new mark
            q.Create(q.Collection('Mark'), {
              data: {
                text: q.Select('text', q.Var('ref2')),
                question: data.ref,
              },
            }),
            // Update an existing mark
            q.Update(
              q.Ref(q.Collection('Mark'), q.Select('id', q.Var('ref2'))),
              {
                data: {
                  text: q.Select('text', q.Var('ref2')),
                },
              }
            )
          )
        )
      )
    )
    await keyedClient.query(qry)
    return {
      statusCode: 200,
      body: JSON.stringify(data),
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
