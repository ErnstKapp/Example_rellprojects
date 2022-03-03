const pcl = require('postchain-client');

const node_api_url = "http://localhost:7740";

const blockchainRID = "cd1f9b9ce4cac6ac6c1e609ce32778f5ed6063d720bba6a0a867e1836b75f3f2";

const rest = pcl.restClient.createRestClient(node_api_url, blockchainRID, 5);

const gtx = pcl.gtxClient.createClient(
    rest,
    Buffer.from(blockchainRID, 'hex'),
    []
);







/*
    function that initializes the first user in the database.
*/

async function initialize(admin){
    const adminPubKey = pcl.util.toBuffer(admin.pubKey);
    const tx = gtx.newTransaction([admin.pubKey]);
    tx.addOperation("init", adminPubKey);
    tx.sign(admin.privKey, admin.pubKey);
    await tx.postAndWaitConfirmation();

}

/*
    A new user can be registered by an already existing one
*/

async function register_employee(
    newEmployee, 
    supervisor,
    nameOfEmployee,
    employeeAge,
    employeeSalary,
    isAdmin){

    const newEmployeePubKey = pcl.util.toBuffer(newEmployee.pubKey);
    const supervisorPubKey = pcl.util.toBuffer(supervisor.pubKey);
    const supervisorPrivKey = pcl.util.toBuffer(supervisor.privKey);
    const tx = gtx.newTransaction([supervisorPubKey]);
   
    tx.addOperation(
        "register_employee", 
        supervisorPubKey,
        newEmployeePubKey,
        nameOfEmployee,
        employeeAge,
        employeeSalary,
        isAdmin);
  
    tx.sign(supervisorPrivKey, supervisorPubKey);
    await tx.postAndWaitConfirmation();

}



async function register_department(administrator, departmentName, newDepartmentID){
    const administratorPubKey = pcl.util.toBuffer(administrator.pubKey);
    const administratorPrivKey = pcl.util.toBuffer(administrator.privKey);
    const tx = gtx.newTransaction([administratorPubKey]);
   
    tx.addOperation("register_department", administratorPubKey,departmentName,newDepartmentID);
  
    tx.sign(administratorPrivKey, administratorPubKey);
    await tx.postAndWaitConfirmation();

}

async function register_project(supervisor, project_Name,project_ID,budget){
    const supervisorPubKey = pcl.util.toBuffer(supervisor.pubKey);
    const supervisorPrivKey = pcl.util.toBuffer(supervisor.privKey);
    const tx = gtx.newTransaction([supervisorPubKey]);
   
    tx.addOperation("register_project", supervisorPubKey,project_Name,project_ID,budget);
  
    tx.sign(supervisorPrivKey, supervisorPubKey);
    await tx.postAndWaitConfirmation();

}


/*
    Transfer balance from one user to the other
*/

/*
    Query for looking up the amount on a given wallet adress
*/

async function get_age(user){
    const userPubKey = pcl.util.toBuffer(user.pubKey);
    /*
      A query can not take in a byte array as argument, so we turn it into a hex string which we later
      in rell can turn into a byte array
    */
    let userHexKey = userPubKey.toString('hex');
    console.log(userHexKey);
    return gtx.query("get_age", {employee_pubkey : userHexKey});
}

async function get_name(user){
    const userPubKey = pcl.util.toBuffer(user.pubKey);
    /*
      A query can not take in a byte array as argument, so we turn it into a hex string which we later
      in rell can turn into a byte array
    */
    let userHexKey = userPubKey.toString('hex');
    console.log(userHexKey);
    return gtx.query("get_name", {employee_pubkey : userHexKey});
}
async function get_salary(user){
    const userPubKey = pcl.util.toBuffer(user.pubKey);
    /*
      A query can not take in a byte array as argument, so we turn it into a hex string which we later
      in rell can turn into a byte array
    */

   
    let userHexKey = userPubKey.toString('hex');
    console.log(userHexKey);
    return gtx.query("get_salary", {employee_pubkey : userHexKey});
}
async function get_department(user){
    const userPubKey = pcl.util.toBuffer(user.pubKey);
    /*
      A query can not take in a byte array as argument, so we turn it into a hex string which we later
      in rell can turn into a byte array
    */

   
    let userHexKey = userPubKey.toString('hex');
    console.log(userHexKey);
    return gtx.query("get_department", {employee_pubkey : userHexKey});
}
async function get_project(user){
    const userPubKey = pcl.util.toBuffer(user.pubKey);
    /*
      A query can not take in a byte array as argument, so we turn it into a hex string which we later
      in rell can turn into a byte array
    */

   
    let userHexKey = userPubKey.toString('hex');
    console.log(userHexKey);
    return gtx.query("get_project", {employee_pubkey : userHexKey});
}
async function new_salary(supervisor,employee,salary){
    const employeePubKey = pcl.util.toBuffer(employee.pubKey);
    const supervisorPubKey = pcl.util.toBuffer(supervisor.pubKey);
    const supervisorPrivKey = pcl.util.toBuffer(supervisor.privKey);
    const tx = gtx.newTransaction([supervisorPubKey]);
    tx.addOperation("new_salary", supervisorPubKey,employeePubKey,salary);
  
    tx.sign(supervisorPrivKey, supervisorPubKey);
    await tx.postAndWaitConfirmation();


}
async function test(){
    /*
        We make two keypairs, admin and user1
    */

    const admin = pcl.util.makeKeyPair();
    const employee1 = pcl.util.makeKeyPair();
    const employee2 = pcl.util.makeKeyPair();
    /*
        Call init with the admin keypair and register user1, transfer 400 to user1
    */

    await initialize(admin);
    // We create an employee with name: Douglas, age: 30, salary: 250, isAdmin: True
    await register_employee(employee1, admin, "Douglas",30,250,1);
    await register_department(employee1, "Finance", 1);
    await register_project(employee1,"Frontend development",1, 10000);
    await register_employee(employee2, employee1, "William",20,150,0);

    let name = await get_name(employee2);
    let salary = await get_salary(employee2);
    let department = await get_department(employee1);
    let project = await get_project(employee1);
    
    await new_salary(employee1,employee2,200);
    let salary2 = await get_salary(employee2);
    
   console.log("Employee " + name + " had salary: " + salary +". But did a great job and has now salary: " + salary2 );
   console.log("His supervisor is aministrator over "+ department + " department and works on " + project );


}

test();