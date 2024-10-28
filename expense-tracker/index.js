
const express = require('express');

const {Transaction, Category} = require('./db');

const app =express();
app.use(express.json());

app.get('/',(req,res)=>{
    res.send("Server is up and running!");
})

app.post('/tansactions' ,async(req,res) => {
    try {
        const {type,category,amount,date,description} = req.body;
        if(!type || !category || !amount || !date || !description){
              return res.status(400).json({error:"Missing required fileds"})
        }
        const transaction = await Transaction.create({type,category,amount,date,description});
        res.status(201).json(transaction);
    } catch (err) {
        res.status(500).json({ error : err.message});
    }
});


app.get('/transactions' , async(req,res) =>{
    try{
        const transaction = await Transaction.findAll();
        res.json(transaction);
    }
    catch(err){ 
        res.status(400).json({error:err.message});
    }
});


app.get('/transactions/:id' ,async(req,res)=>{
    try{
        const transaction = await Transaction.findByPk(req.params.id);
        if(transaction){
            res.json(transaction);
        } else{
            res.status(404).json({error:'Transaction not found'});
        }
    }
    catch(err){
        res.status(400).json({error:err.message});
    }
    
});


app.put('/transactions/:id' , async(req,res)=>{
     try{
        const id=req.params.id;
        const {type,category,amount,date,description}=req.body;
        const transaction = await Transaction.findByPk(id);
        if(!transaction){
            res.status(404).json(({error:'Transaction not found'}));
        }
            transaction.type=type;
            transaction.category= category;
            transaction.amount=amount;
            transaction.date=date;
            transaction.description=description;
            
            await transaction.save();
            res.json(transaction);
        
     }catch(err){
         res.status(400).json({error : err.message});
     }
}); 

app.delete("/test/" , (req,res)=>{
   res.send("Delete route working");
})
app.delete("/transactions/:id" , async(req,res) => {
    console.log("Delete route hit"); 
    try{
      const id=req.params.id;  
      await Transaction.destroy({where:{id:id}});
      res.status(204).send(); 
    }catch(err){
        res.status(500).josn({error:"Failed to delete the transaction"})
    }
});


app.get('/summary' ,async(req,res)=>{
    try{
      const transactons = await Transaction.findAll();

      const summary = {
        totalIncome:0,
        totalExpense:0,
        balance:0,
      };

      transactons.forEach(transaction =>{
        if(transaction.type==="income"){
            summary.totalIncome+=transaction.amount;
        }
        else if(transaction.type==="expense"){
            summary.totalExpense+=transaction.amount;
        }
      });

      summary.balance=summary.totalIncome-summary.totalExpense;
      res.json(summary);
    }catch(err){
        res.status(400).json({error:err.message});
    }
})

const PORT = 3000;

app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`);
});