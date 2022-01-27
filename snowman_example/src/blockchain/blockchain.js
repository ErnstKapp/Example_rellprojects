import pcl from "postchain-client";

const blockchain = (function () {
  let gtx;
  const adminPubkey = Buffer.from(
    "031b84c5567b126440995d3ed5aaba0565d71e1834604819ff9c17f5e9d5dd078f",
    "hex"
  );
  const adminPrivkey = Buffer.from(
    "0101010101010101010101010101010101010101010101010101010101010101",
    "hex"
  );

  const init = async (nodeUri) => {
    try {
      // These settings needs to be configured to communicate with your backend
      const nodeApiUrl = "https://rellide-staging.chromia.dev/node/17845/";
      const blockchainRID =
        "7E9B724530B844D8FB208DEF722A545639405EC13BF4EC5E6A82AB065FD209E6";
      const rest = pcl.restClient.createRestClient(
        nodeApiUrl,
        blockchainRID,
        5
      );

      gtx = pcl.gtxClient.createClient(
        rest,
        Buffer.from(blockchainRID, "hex"),
        []
      );
      const result = await gtx.query("get_user_by_username", {
        username: "admin",
      });
      if (!result) {
        // Intialize the database
        const rq = gtx.newTransaction([adminPubkey]);
        rq.addOperation("init", adminPubkey);
        rq.sign(adminPrivkey, adminPubkey);
        await rq.postAndWaitConfirmation();
      }

      console.log("Postchain client initialized.");
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const getGtx = () => gtx;

  return {
    init,
    getGtx,
  };
})();

export default blockchain;
