import {
  accountLookup,
  billingAccountLookup,
  contactLookup,
  createAccount,
  createContact,
  updateContact,
  createConnection,
} from "../../shop/lib/salesForce";

export default async function handler(req, res) {
  if (req.method === "POST" && !req.query.create) {
    try {
      console.time("salesforce lookup requests");
      const contactInfo = JSON.parse(req.body);
      const conn = await createConnection();
      async function handleSalesforceRequests() {
        try {
          // first execute contact lookup
          const contacts = await contactLookup(conn, contactInfo.email);
          console.log("contacts", contacts);
          if (contacts && contacts.length > 0) {
            let accountNotFound = true; // will be set when account is found.
            for (let i = 0; i < contacts.length; i++) {
              if (
                contacts[i].Account.Id &&
                contacts[i].Account.Website === contactInfo.website
              ) {
                accountNotFound = false; // contact match = success, account match = success
                const billingAcc = await billingAccountLookup(
                  conn,
                  contacts[i].Account.Id
                );
                if (billingAcc) {
                  console.log("scenario 1 case 1");
                  throw new Error("billingAccountError1");
                } else {
                  console.log("scenario 1 case 2");
                  // Dumping form data to contacts[i]
                  const contactId = await updateContact(
                    conn,
                    contactInfo,
                    contacts[i].Id
                  );
                  console.timeEnd("salesforce lookup requests");
                  return {
                    contactInfo,
                    contact: contacts[i],
                    account: contacts[i].Account,
                  };
                }
              }
            }
            if (accountNotFound) {
              console.log("scenario 3");
              // Create Contact and Account
              // const acc = await createAccount(conn, contactInfo);
              // const cont = await createContact(conn, contactInfo, acc, false);
              console.timeEnd("salesforce lookup requests");
              return {
                contact: null,
                account: null,
                contactInfo,
              };
            }
          } else {
            // scenario 2
            const accounts = await accountLookup(conn, contactInfo.website);
            console.log("accounts", accounts);
            if (accounts && accounts.length > 0) {
              // contact match = fail, account match = success
              for (let i = 0; i < accounts.length; i++) {
                const billingAcc = await billingAccountLookup(
                  conn,
                  accounts[i].Id
                );
                if (billingAcc) {
                  console.log("scenario 2 case 1");
                  throw new Error("billingAccountError2");
                } else {
                  console.log("scenario 2 case 2");
                  // creating contact
                  console.timeEnd("salesforce lookup requests");
                  return {
                    contactInfo,
                    contact: null,
                    account: accounts[i],
                  };
                }
              }
            } else {
              console.log("scenario 4");
              console.log(contactInfo);
              // Create Contact and Account
              // const acc = await createAccount(conn, contactInfo);
              // const cont = await createContact(conn, contactInfo, acc, true);
              console.timeEnd("salesforce lookup requests");
              return {
                contact: null,
                account: null,
                contactInfo,
              };
            }
          }
        } catch (error) {
          throw new Error(error.message);
        }
      }
      const result = await handleSalesforceRequests();
      res.status(200).json(JSON.stringify(result));
    } catch (error) {
      let cause = null;
      // Scenario 1: Contact match = success, Account match = success
      if (error.message === "billingAccountError1")
        cause =
          "Oops! It looks like you may already have a UJET account. Please reach out to support@ujet.cx for assistance.";
      // Scenario 2: Contact match = fail, Account match = success
      else if (
        error.message === "billingAccountError2" ||
        error.message === "DUPLICATES_DETECTED"
      )
        cause =
          "Oops! It looks like there was a problem. We may already have an account for you. Please reach out to sales@ujet.cx and we'll help fix this!";
      console.timeEnd("salesforce lookup requests");
      res.status(200).json({ error: cause, cause });
    }
    // split the account and contact creation from the lookup requests to make the flow feel faster.
  } else if (req.method === "POST" && req.query.create) {
    try {
      console.time("salesforce create requests");
      const returnData = {
        contact: null,
        account: null,
        contactInfo: null,
      };
      const reqBody = JSON.parse(req.body);
      returnData.contactInfo = reqBody.contactInfo;
      let accountId = reqBody.account?.Id || null;

      const conn = await createConnection();

      if (!reqBody.account) {
        const acc = await createAccount(conn, returnData.contactInfo);
        accountId = acc;
        returnData.account = { Id: acc };
      } else {
        returnData.account = reqBody.account;
      }
      if (!reqBody.contact && accountId) {
        const cont = await createContact(
          conn,
          returnData.contactInfo,
          accountId,
          true
        );
        returnData.contact = { Id: cont };
      } else if (reqBody.contact) {
        returnData.contact = reqBody.contact;
      }

      if (!returnData.contact) delete returnData.contact;
      if (!returnData.account) delete returnData.account;
      console.timeEnd("salesforce create requests");
      res.status(200).json(JSON.stringify(returnData));
    } catch (error) {
      let cause = null;
      // Scenario 2: Contact match = fail, Account match = success
      if (error.message === "DUPLICATES_DETECTED")
        cause =
          "Oops! It looks like there was a problem. We may already have an account for you. Please reach out to sales@ujet.cx and we'll help fix this!";
      res.status(200).json({ error: error.message, cause });
    }
  } else res.status(405).json({ error: "Not Allowed" });
}
