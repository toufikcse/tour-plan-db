const express = require('express');
const { MongoClient, Admin } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vljcn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('bikechoicedb');
        const productCollection = database.collection('bikes');
        const orderCollection = database.collection('orders');
        const userCollection = database.collection('user');
        const reviewCollection = database.collection('review');


        // add product
        app.post("/addbike", async (req, res) => {
            const bikes = req.body;
            const result = await productCollection.insertOne(bikes);
            res.json(result);
            console.log(result);
        })

        app.post("/customerorder", async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.json(result);
            console.log(result);
        })

        app.post("/review", async (req, res) => {
            const order = req.body;
            const result = await reviewCollection.insertOne(order);
            res.json(result);
            console.log(result);
        })

        /////get admin
        app.get("/findadmin/:email", async (req, res) => {
            const email = req.params.email;
            const queary = { email: email };
            const result = await userCollection.find(queary).toArray();
            res.json(result);
        })

        /////myorder user
        app.get("/myorder/:email", async (req, res) => {
            const email = req.params.email;
            const queary = { email: email };
            const result = await orderCollection.find(queary).toArray();
            res.json(result);
        })

        /////get reviews
        app.get('/getreviews', async (req, res) => {
            const cursor = reviewCollection.find({});
            const result = await cursor.toArray();
            // console.log(result);
            res.send(result);
        })

        app.post("/adduser", async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.json(result);
            console.log(result);
        })

        app.put("/adduser", async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updatedoc = { $set: user };
            const result = await userCollection.updateOne(filter, updatedoc, options);
            res.json(result);
            console.log(result);
        })

        app.put("/adduser/admin", async (req, res) => {
            const user = req.body;
            console.log(user);
            const filter = { email: user.email };
            const updatedoc = { $set: { role: 'admin' } };
            const result = await userCollection.updateOne(filter, updatedoc);
            res.json(result);
            console.log(result);
        })

        //get api
        app.get('/bikes', async (req, res) => {
            const cursor = productCollection.find({});
            const result = await cursor.toArray();
            // console.log(result);
            res.send(result);
        })

        ///delete myorder
        app.delete("/dashboard/myorder/:id", async (req, res) => {
            const id = req.params.id;
            const queary = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(queary);
            console.log('deleting order id ' + result);
            res.json(result);
        })

    }
    finally {

    }
}
run().catch(console.dir);

// client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     // perform actions on the collection object
//     console.log('hiting the database');
//     client.close();
// });


app.get('/', (req, res) => {
    res.send('Bike Choice DB');
});

app.listen(port, () => {
    console.log('Bike Choice Port', port);
})