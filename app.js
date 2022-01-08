const { response } = require('express');
const express = require('express');
const { request } = require('http');
const path =require('path');
const {open}=require('sqlite');
const sqlite3=require('sqlite3');
const app = express();
app.use(express.json());

const dbpath=path.join(__dirname,"./employes.db");
let db;
const initailizeDBAndSever=async()=>{
    try{ 
        db = await open({
            filename:dbpath,
            driver:sqlite3.Database
        });
        console.log('DB Connected')
    }catch(e){
        console.log("DB error");
        process.exit(1)
    }
};
initailizeDBAndSever();

const port = 4000

app.get('/details',async(request,response)=>{
   const getEmployeesQuery=`SELECT * FROM employees;`;
   const details=await db.get(getEmployeesQuery);
   response.send(details)
})

app.post('/create',async (request,response)=>{
    const employeeDetails=request.body;
    const {id,firstname,lastname,salary,employee_id}=employeeDetails;

    const addEmployeeDetail=`INSERT INTO employees(id,firstname,lastname,salary,employee_id)
    VALUES(${id},
        '${firstname}',
        '${lastname}',
        ${salary},
        ${employee_id}
        );`;
        console.log(addEmployeeDetail)

   const dbResponse=await db.run(addEmployeeDetail);
   const employeeId=dbResponse.lastId;
   response.status(200).json({addEmployeeDetail});
});

app.put("/update/:id",async(request,response)=>{
    const {id}=request.params;
    const employeeDetails=request.body;
    const {firstname,lastname,salary,employee_id}=employeeDetails;

    const updateEmployeeDetails=`
    UPDATE employees
    SET 
    firstname='${firstname}',
    lastname='${lastname}',
    salary=${salary},
    employee_id=${employee_id}
    WHERE id=${id}; `;
    const updateresponse=await db.run(updateEmployeeDetails);
    response.status(200).json({updateresponse});
});

app.delete("/details/:id",async(request,response)=>{
    const {id}=request.params;
    const deletingemployeeDetails=`
    DELETE FROM employees
    WHERE id=${id};`;
    console.log(deletingemployeeDetails)
    const deletedresponse=await db.run(deletingemployeeDetails);
    response.status(200).json({deletedresponse});
});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})