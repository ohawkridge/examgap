import { query as q } from 'faunadb'
import { createClient } from '@/api'

// Get a login token which identifies this user
export default async function getLoginToken(username, password) {
  // Create Fauna client using server secret key from Netlify
  const client = await createClient()
  try {
    const { secret } = await client.query(
      q.Login(q.Match(q.Index('user_by_username'), username), {
        password,
        ttl: q.TimeAdd(q.Now(), 7, 'days'),
      })
    )
    return secret
  } catch (e) {
    console.warn(e)
  }
}
