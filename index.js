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
        const chartCollection = client.db("antiquity").collection("ChartData");
        const imageCollection = client.db("antiquity").collection("image");
        const tableCollection = client.db("antiquity").collection("table");


        // ---------------------- Category section ----------------------------

        app.get("/products", async (req, res) => {
            const query = {}
            const result = await productsCollection.find(query).toArray()
            res.send(result)
        })


        // ---------------------- data table section ----------------------------

        app.get('/tableData', async (req, res) => {
            const query = {}
            const result = await tableCollection.find(query).toArray()
            res.send(result)
        })

        // ---------------------- chart section ----------------------------

        app.get("/chartData", async (req, res) => {
            const query = {}
            const result = await chartCollection.find(query).toArray()
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