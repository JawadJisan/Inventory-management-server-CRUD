const express = require('express')
const app = express()
const port = process.env.PORT || 4000;
const cors = require('cors');
require('dotenv').config()

app.use(express.json());
app.use(cors());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

/* 
admin
YkH9QWoeFchyilnO
*/


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.exipmzm.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const inventoryCollection = client.db("allCollection").collection("items");

        app.get('/mongo', (req, res) => {
            res.send('Hello Happy MongoDb MongoDB connected World!')
          })

        // get api to read all products
        // http://localhost:4000/notes
        app.get('/notes', async (req, res) => {

            const query = req.query;
            const cursor = inventoryCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

        app.post('/note',async (req, res) => {
            const data = req.body;
            console.log(data);
            const result = await inventoryCollection.insertOne(data);
            res.send(result);
        })

        // update products details
        // http://localhost:4000/note/6269426e93bbf832d4e5f9d8
        app.put('/note/:id',async (req, res)=>{
            const id = req.params.id;
            const data = req.body;
            console.log('from put' ,data);
            const filter = { _id: ObjectId(id)};
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    productName: data.productName, 
                    productType : data.productType,
                    price : data.price,
                    description : data.description

                },
              };
            const result = await inventoryCollection.updateOne(filter, updateDoc, options);
            res.send(result);




        })


        // delet products
        // http://localhost:4000/note/6269426e93bbf832d4e5f9d8
        app.delete('/note/:id',async(req, res)=>{
            const id= req.params.id;
            const filter = { _id: ObjectId(id)};
            const result = await inventoryCollection.deleteOne(filter);
            res.send(result);



        })
    }
    finally {

    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Hello Happy  World!')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })