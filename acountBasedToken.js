const pcl = require('postchain-client');

const node_api_url = "http://localhost:7740";

const blockchainRID = "61c263954042fa1474a4c9a9bc5a47496932e0ae48a757b1ce4c45df17d2715c";

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

async function register_user(newUser, oldUser, nameOfUser){
    const newUserPubKey = pcl.util.toBuffer(newUser.pubKey);
    const oldUserPubKey = pcl.util.toBuffer(oldUser.pubKey);
    const oldUserPrivKey = pcl.util.toBuffer(oldUser.privKey);
    const tx = gtx.newTransaction([oldUserPubKey]);
   
    tx.addOperation("register_user", oldUserPubKey, newUserPubKey, nameOfUser);
  
    tx.sign(oldUserPrivKey, oldUserPubKey);
    await tx.postAndWaitConfirmation();

}

/*
    Transfer balance from one user to the other
*/

async function transferbalance(fromUser, toUser, amount) {
    const fromUserPubKey = pcl.util.toBuffer(fromUser.pubKey); 
    const fromUserPrivKey = pcl.util.toBuffer(fromUser.privKey);
    const toUserPubKey = pcl.util.toBuffer(toUser.pubKey);
    const tx = gtx.newTransaction([fromUserPubKey]);
    tx.addOperation("transfer_balance", fromUserPubKey, toUserPubKey, amount);
    tx.sign(fromUserPrivKey, fromUserPubKey);
    await tx.postAndWaitConfirmation();

}

/*
    Query for looking up the amount on a given wallet adress
*/

async function get_balance(user){
    const userPubKey = pcl.util.toBuffer(user.pubKey);
    /*
      A query can not take in a byte array as argument, so we turn it into a hex string which we later
      in rell can turn into a byte array
    */
    let userHexKey = userPubKey.toString('hex');
    console.log(userHexKey);
    return gtx.query("get_balance", {user_pubkey : userHexKey});
}

async function test(){
    /*
        We make two keypairs, admin and user1
    */

    const admin = pcl.util.makeKeyPair();
    const user1 = pcl.util.makeKeyPair();

    /*
        Call init with the admin keypair and register user1, transfer 400 to user1
    */

    await initialize(admin);
    await register_user(user1, admin, "mrtest");
    await transferbalance(admin, user1, 400);

    /*
        Check the balance for user1
    */

    let balance = await get_balance(user1);
    console.log(balance);


}

test();