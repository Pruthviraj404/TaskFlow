import express from "express";
import { connectDB } from "./database.js";
import cors from 'cors';

const app = express();



const PORT=5000;

app.use(express.json());
app.use(cors());


let db;
(async ()=>{
    db=await connectDB();
})();


app.get("/",(req,res)=>{
    res.send("Task Flow is Running!");
});


app.get("/api/tasks",async(req,res)=>{
    try{

        const {status} = req.query;

        let tasks;

        if(status==="overdue"){

        
        tasks= await db.all(`SELECT * FROM tasks WHERE due_date < DATE('now') AND is_done =0`);
       
        }
        else{
            tasks = await db.all('SELECT * FROM tasks');
             
        }
        res.json(tasks);
           

    }catch(error){
        console.error(error);
        res.status(500).json({error:"Something went wrong"});

    };
});

app.post("/api/tasks",async(req,res)=>{
    try{
        const {title, description, category, priority, due_date}=req.body;
       
        const result= await db.run(
            `INSERT INTO tasks (title,description,category,priority,due_date)
            VALUES(?,?,?,?,?)`,
            [title,description,category,priority,due_date]
        );

        res.status(201).json({
            id:result.lastID,
            title,
            description,
            category,
            priority,
            due_date,
            is_done:0



        });


    }catch(error){
        console.error(error);
        res.status(500).json({error:"Something went wrong"});

    }

});

app.delete("/api/tasks/:id", async(req,res)=>{

    try{

    const id =req.params.id;
 
    
    const result = await db.run(
        "DELETE FROM tasks WHERE id = ?",[id]);

    if(result.changes===0){
        return res.status(404).json({message:"Task Not Found"});
    }  

      res.json({ message: "Task deleted successfully" });
}catch(error){
    console.error(error);
    res.status(500).json({error:"Something went wrong"});

}  

});

app.patch("/api/tasks/:id/done", async(req,res)=>{
    try{
        const id= req.params.id;

        const result= await db.run(
            "UPDATE tasks SET is_done = NOT is_done WHERE id =?",[id]
        );

        if(result.changes===0){
            res.status(404).json({message:"Task Not Found !"})
        }

        res.status(201).json({message:"Task Status Toggled Successfully"});


    }catch(error){
        res.status(500).json("Something went wrong!");
    }
})

app.listen(PORT,()=>{
    console.log(`Server is Running on PORT: ${PORT}`);
});



