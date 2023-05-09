const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.port || 5000;
app.use(cors());
app.use(express.json());



// Database connection
// console.log(process.env.DB_PASS);
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zrkqnje.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);




// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const usersCollection = client.db('userDB').collection('users')




        // To read or get all Data from database
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })
        // To read or get a single data
        app.get('/user/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: new ObjectId(id) };
            const result = await usersCollection.findOne(query);
            res.send(result);


        })
        // To post or create data into database
        app.post('/user', async (req, res) => {
            const newUser = req.body;
            const result = await usersCollection.insertOne(newUser);
            res.send(result);
        })
        // Delete data from database
        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id);
            const query = { _id: new ObjectId(id) };
            const result = await usersCollection.deleteOne(query);
            res.send(result)
        })
        // Update the User
        app.put('/user/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const options = { upsert: true };
            const filter = { _id: new ObjectId(id) }
            const updatedUser = req.body;
            console.log(updatedUser)
            const user = {
                $set: {
                    name: updatedUser.name,
                    email: updatedUser.email,
                    gender: updatedUser.gender,
                    status: updatedUser.status
                }
            }

            const result = await usersCollection.updateOne(filter, user, options);
            res.send(result);
        })
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('User Management Server Is Running...')
})
app.listen(port, () => {
    console.log(`User Management Server Is Running On Port ${port}`);
})
