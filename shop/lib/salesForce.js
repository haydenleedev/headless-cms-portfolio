const jsforce = require("jsforce");

export async function login() {
  let credentials = {};
  let conn = new jsforce.Connection({
    loginUrl: process.env.SALESFORCE_LOGIN_URL,
  });
  await conn.login(
    process.env.SALESFORCE_USERNAME,
    `${process.env.SALESFORCE_PASSWORD}${process.env.SALESFORCE_SECURITY_TOKEN}`,
    function (err, userInfo) {
      if (err) {
        return console.error(err);
      }

      credentials = {
        access_token: conn.accessToken,
        instanceUrl: conn.instanceUrl,
      };
    }
  );
  return credentials;
}

export function createConnection() {
  return new Promise((resolve, reject) => {
    const connection = new jsforce.Connection({
      loginUrl: process.env.SALESFORCE_LOGIN_URL,
    });
    connection
      .login(
        process.env.SALESFORCE_USERNAME,
        `${process.env.SALESFORCE_PASSWORD}${process.env.SALESFORCE_SECURITY_TOKEN}`,
        function (err, userInfo) {
          if (err) {
            reject(err.message);
          }
        }
      )
      .then(() => resolve(connection));
  });
}

export async function contactLookup(connection, email) {
  try {
    let record = [];
    /* let conn = new jsforce.Connection({
      instanceUrl: credentials["instanceUrl"],
      accessToken: credentials["access_token"],
    }); */
    await connection
      .sobject("Contact")
      .find(
        // conditions in JSON object
        { Email: email },
        // fields in JSON object
        {
          Id: 1,
          Name: 1,
          "Account.Id": 1,
          "Account.name": 1,
          "Account.billingAddress": 1,
          "Account.Website": 1,
          CreatedDate: 1,
        }
      )
      .execute(function (err, records) {
        if (err) {
          return console.error(err);
        }
        record = records;
      });
    if (record != []) {
      return record;
    }
    return [];
  } catch (error) {
    throw new Error("Contact Lookup Failed.");
  }
}

export async function accountLookup(connection, website) {
  try {
    let record = [];
    /* let conn = new jsforce.Connection({
      instanceUrl: credentials["instanceUrl"],
      accessToken: credentials["access_token"],
    }); */
    await connection
      .sobject("Account")
      .find(
        // conditions in JSON object
        { Website: website }
      )
      .execute(function (err, records) {
        if (err) {
          return console.error(err);
        }
        record = records;
      });
    if (record != []) {
      return record;
    }
    return [];
  } catch (error) {
    throw new Error("Account Lookup Failed.");
  }
}

export async function createContact(
  connection,
  contactInfo,
  accountId,
  dataDump
) {
  try {
    let contactId;
    /* let conn = new jsforce.Connection({
      instanceUrl: credentials["instanceUrl"],
      accessToken: credentials["access_token"],
    }); */
    let data = {
      FirstName: contactInfo.firstName,
      LastName: contactInfo.lastName,
      Email: contactInfo.email,
      Phone: contactInfo.phone,
      AccountId: accountId,
    };
    if (dataDump) {
      data.Self_Service_Form_Data__c = JSON.stringify(contactInfo);
    }
    await connection.sobject("Contact").create(data, function (err, ret) {
      if (err || !ret.success) {
        return console.error(err, ret);
      }
      contactId = ret.id;
    });
    return contactId;
  } catch (error) {
    throw new Error("Contact Creation Failed.");
  }
}

export async function updateContact(connection, contactInfo, contactId) {
  try {
    let res;
    /* let conn = new jsforce.Connection({
      instanceUrl: credentials["instanceUrl"],
      accessToken: credentials["access_token"],
    }); */
    await connection.sobject("Contact").update(
      {
        Id: contactId,
        Self_Service_Form_Data__c: JSON.stringify(contactInfo),
      },
      function (err, ret) {
        if (err || !ret.success) {
          return console.error(err, ret);
        }
        res = ret.id;
      }
    );
    return res;
  } catch (error) {
    throw new Error("Contact Update Failed.");
  }
}

export async function createAccount(connection, contactInfo) {
  try {
    let AccountId;
    /* let conn = new jsforce.Connection({
      instanceUrl: credentials["instanceUrl"],
      accessToken: credentials["access_token"],
    }); */
    await connection.sobject("Account").create(
      {
        Name: contactInfo.companyName,
        Type: "Prospect",
        Website: contactInfo.website,
        SDR__c: "0051I000004ftf2",
        BillingStreet: contactInfo.street,
        BillingCity: contactInfo.city,
        BillingState: contactInfo.state,
        BillingCountry: contactInfo.country,
        BillingPostalCode: contactInfo.zipCode,
        Headquarter_Country__c: contactInfo.country,
        EcomSalesChannel__c: "ecom",
      },
      function (err, ret) {
        if (err || !ret.success) {
          return console.error(err, ret);
        }
        AccountId = ret.id;
      }
    );
    return AccountId;
  } catch (error) {
    if (error.name.includes("DUPLICATES_DETECTED")) {
      throw new Error("DUPLICATES_DETECTED");
    }
    throw new Error("Account Creation Failed.");
  }
}

export async function createLead(connection, leadInfo) {
  let LeadId;
  /* let conn = new jsforce.Connection({
    instanceUrl: credentials["instanceUrl"],
    accessToken: credentials["access_token"],
  }); */
  await connection.sobject("Lead").create(
    {
      FirstName: leadInfo.firstName,
      LastName: leadInfo.lastName,
      Email: leadInfo.email,
      Title: leadInfo.jobTitle,
      Company: leadInfo.companyName,
      Phone: leadInfo.phone,
      Website: leadInfo.website,
      of_Agent__c: leadInfo.employees,
    },
    function (err, ret) {
      if (err || !ret.success) {
        return console.error(err, ret);
      }
      LeadId = ret.id;
    }
  );
  return LeadId;
}

export async function billingAccountLookup(connection, accountId) {
  try {
    let record = [];
    /* let conn = new jsforce.Connection({
      instanceUrl: credentials["instanceUrl"],
      accessToken: credentials["access_token"],
    }); */
    await connection
      .sobject("Zuora__CustomerAccount__c")
      .find(
        // conditions in JSON object
        { Zuora__Account__c: accountId }
      )
      .execute(function (err, records) {
        if (err) {
          return console.error(err);
        }
        record = records;
      });
    if (record.length > 0) {
      return record[0];
    }
    return null;
  } catch (error) {
    throw new Error("Billing Account Lookup Failed.");
  }
}

export async function billingAccountLookup2(connection, lastname) {
  let record = [];
  /* let conn = new jsforce.Connection({
    instanceUrl: credentials["instanceUrl"],
    accessToken: credentials["access_token"],
  }); */
  await connection
    .sobject("Zuora__CustomerAccount__c")
    .find(
      // conditions in JSON object
      { Name: lastname }
    )
    .execute(function (err, records) {
      if (err) {
        return console.error(err);
      }
      record = records;
    });

  if (record != []) {
    return record;
  }
  return [];
}

export async function createBillingAccount(connection, accountId) {
  let Id;
  /* let conn = new jsforce.Connection({
    instanceUrl: credentials["instanceUrl"],
    accessToken: credentials["access_token"],
  }); */
  await connection.sobject("Zuora__CustomerAccount__c").create(
    {
      Name: accountId,
      Zuora__Account__c: accountId,
    },
    function (err, ret) {
      if (err || !ret.success) {
        return console.error(err, ret);
      }
      Id = ret.id;
    }
  );
  return Id;
}
