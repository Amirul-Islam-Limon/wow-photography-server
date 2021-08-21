const express = require('express')
const app = express()
const { MongoClient} = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');
const ObjectID=require('mongodb').ObjectId
require('dotenv').config();


const port = process.env.PORT || 9999;
app.use(cors());
app.use(bodyParser.json())
app.use(express.json())
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mvdkd.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const serviceCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_COLLECTION}`);
  const allUserCollection = client.db(`${process.env.DB_NAME}`).collection("userInfo");
  const orderCollection = client.db(`${process.env.DB_NAME}`).collection("orderList");
  

  app.post('/addService',(req, res)=>{
      const serviceData=req.body;
      serviceCollection.insertOne(serviceData)
      .then(result=>{
          res.send(result.acknowledged)
      })
  })


  app.get('/getService',(req, res)=>{
      serviceCollection.find({})
      .toArray((error, document)=>{
          res.send(document)
      })
  })

  app.get('/serviceDetails/:id',(req, res)=>{
        const id= req.params.id
        serviceCollection.find({"_id":ObjectID(id)})
        .toArray((error, document)=>{
            res.send(document[0])
        })
  })


  app.post('/addUserInfo',(req,res)=>{
      const data = req.body;
      allUserCollection.insertOne(data)
      .then(result=>{
          res.send(result.acknowledged)
      })
    //   console.log(data)
  })


  app.get('/getUserInfo/:mail',(req, res)=>{
    const email= req.params.mail
    allUserCollection.find({"email":email})
    .toArray((error, document)=>{
        res.send(document[0])
    })
})


app.post('/addOrder',(req,res)=>{
    const data = req.body;
    orderCollection.insertOne(data)
    .then(result=>{
        res.send(result.acknowledged)
    })
})


app.get('/getOrder/:email',(req,res)=>{
    const email =  req.params.email
    orderCollection.find({email:email})
    .toArray((error, documents)=>{
        res.send(documents)
    })
})


app.get('/getAllOrder',(req,res)=>{
    orderCollection.find({})
    .toArray((error, documents)=>{
        res.send(documents)
    })
})


app.put('/changeStatus',(req,res)=>{
    const id=req.query.id
    const status= req.query.status
  
    orderCollection.updateOne({_id:ObjectID(id)},{
      $set:{
        status:status
      }
    })
    .then(result=>{
    })
  })


  app.delete('/deleteFromOrderedList/:id',(req,res)=>{
    const id=req.params.id
    orderCollection.deleteOne({_id:ObjectID(id)})
    .then(result=>{
      res.send(result.acknowledged)
    })
  })


console.log("Connection Successful!")
});


app.get('/',(req,res)=>{
    res.send('This is test1!')
  })
  
app.listen(port)