import {express} from 'express'


const app = express()
app.use(express.json());
app.listen(PORT, ()=> console.log(`el servidor esta levantado en el puerto ${PORT}`))


export default app