import 'dotenv'

import express, { urlencoded } from 'express'

const port = process.env.PORT 
const app = express()

app.use(express.json())
app.use(urlencoded({extends: true}))

app.get('/', (req, res) => {

    res.send('---');
})

app.listen(port, ()=> {
   console.log('server started at port', port);
    
})