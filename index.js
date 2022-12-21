require('dotenv').config()
const express = require('express');
const app = express()
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors())
app.use(express.json())


app.get('/', (req, res) => {
    res.send("server is running")
})


const uri = `mongodb+srv://${process.env.DBUSER_NAME}:${process.env.DBUSER_PASSWORD}@cluster0.twfgu.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const productsCollection = client.db("antiquity").collection("products");
        const userCollection = client.db("antiquity").collection("user");
        const tableUserCollection = client.db("antiquity").collection("tableUser");


        // ---------------------- product section ----------------------------

        app.post("/addProduct", async (req, res) => {
            const data = req.body
            console.log(data);
            const result = await productsCollection.insertOne(data)
            res.send(result)
        })


        // ---------------------- user table section ----------------------------

        app.get('/getAllUser', async (req, res) => {
            const query = {}
            const result = await tableUserCollection.find(query).toArray();
            res.send(result)

        })

        app.get('/singleUser/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: ObjectId(id) }
            const result = await tableUserCollection.findOne(filter)
            res.send(result)

        })

        app.post('/addUser', async (req, res) => {
            const data = req.body
            const result = await tableUserCollection.insertOne(data)
            res.send(result)
        })

        app.put("/updateUser/:id", async (req, res) => {
            const id = req.params.id
            const data = req.body
            const filter = { _id: ObjectId(id) }
            // const options = { upsert: true }
            const updateUser = {
                $set: {
                    image: data.image,
                    data: {
                        name: data.data.name,
                        email: data.data.email,
                        role: data.data.role,
                        plan: data.data.plan,
                        staus: data.data.staus,
                    }
                }
            }
            const result = await tableUserCollection.updateOne(filter, updateUser)
            res.send(result)
        })

        app.delete("/deleteUser/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await tableUserCollection.deleteOne(query)
            res.send(result)
        })


        //------------------- photo Manage ------------------------

        app.get('/getImage', async (req, res) => {
            const query = {}
            const result = await imageCollection.find(query).toArray()
            res.send(result)
        })

        app.post("/saveImage", async (req, res) => {
            const image = req.query
            const cursor = await imageCollection.insertOne(image)
            res.send(cursor)
        })

        app.delete("/deleteImage/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await imageCollection.deleteOne(query)
            res.send(result)
        })


        //------------------- user Manage ------------------------
        app.get('/usersCheck/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const result = await userCollection.findOne(query)
            res.send({ useCheck: result?.userType })

        })

        app.post("/makeUser", async (req, res) => {
            const userData = req.body;
            const cursor = await userCollection.insertOne(userData)
            res.send(cursor)
        })
    }
    finally { }
}
run().catch(err => { console.log(err) })



app.listen(PORT, () => {
    console.log(`server is running at http://localhost:${PORT}`);
})