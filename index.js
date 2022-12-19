require('dotenv').config()
const express = require('express');
const app = express()
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

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


        // ---------------------- Category section ----------------------------

        app.get("/products", async (req, res) => {
            const query = {}
            const result = await productsCollection.find(query).toArray()
            res.send(result)
        })


        // ---------------------- chart section ----------------------------

        app.get("/chartData", async (req, res) => {
            const query = {}
            const result = await chartCollection.find(query).toArray()
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