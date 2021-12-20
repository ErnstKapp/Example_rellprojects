const pcl = require('postchain-client');

const node_api_url = "http://localhost:7740";

const blockchainRID = "bf0a68985e241cacb1c7b1052ab5ba9c6372d528aff1ec076951b737ea121ab2";

const rest = pcl.restClient.createRestClient(node_api_url, blockchainRID, 5);

const gtx = pcl.gtxClient.createClient(
    rest,
    Buffer.from(blockchainRID, 'hex'),
    []
);

const user = pcl.util.makeKeyPair();


const pubKey = pcl.util.toBuffer(user.pubKey);


// defining function that adds a date into the databse
async function add_date(new_date, pubkey){

    const tx = gtx.newTransaction([user.pubKey]);
    tx.addOperation("add_date", new_date, pubKey);
    tx.sign(user.privKey, user.pubKey);
    await tx.postAndWaitConfirmation();

}
// defining function that adds an activity into the databse
async function add_activity(new_activity, date_to_insert_into, time, pubkey){
    
    const tx = gtx.newTransaction([user.pubKey]);
    tx.addOperation("add_activity", time, date_to_insert_into, new_activity, pubKey);
    tx.sign(user.privKey, user.pubKey);
    await tx.postAndWaitConfirmation();

}


//  defining function that fetches the activity of a date

async function get_activity(date){
    return gtx.query("get_activities_from_date", {date_int: date})

}
//  defining function that fetches the date of an activity
async function get_Date(activity) {

    return gtx.query("get_date_from_activity", {activity_string: activity})
}

async function test(){
    let date = 20200422;
// We add a date to the database with the dateID  "20200422" 

    await add_date(date, pubKey);

    // We add an activity with the dateID date and activity_name "player"
    await add_activity("player", date, "16:00", pubKey);

    // We return the activity from date
    activity_ = await get_activity(date);
    console.log(activity_);
    
    
    
    let activity = "player";
    //We return the date from the activity
    date_ = await get_Date(activity);
    console.log(date_);
}

test();

