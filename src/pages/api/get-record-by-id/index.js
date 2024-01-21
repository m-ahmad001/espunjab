import supabase from 'src/configs/supabase'

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    // Handle preflight request
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    res.status(200).end()

    return
  }

  if (req.method === 'POST') {
    // Handle POST request
    try {
      const { id } = req.body // Assuming the ID is passed in the request body

      let { data: rec, error } = await supabase.from('forms').select('*').eq('id', id).single()

      // Set CORS headers to allow any origin
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
      res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')

      // Respond with the data
      res.status(200).json(rec)
    } catch (error) {
      console.error('Error:', error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  } else {
    // Method not allowed
    res.status(405).json({ error: 'Method Not Allowed' })
  }
}
