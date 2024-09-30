// src/services/userService.js

const {
    putItemToDynamoDB,
    getItemFromDynamoDB,
    listItemsInDynamoDB,
    batchWriteItemsToDynamoDB
} = require('./aws/dynamoDbService'); // Adjust the path based on your project structure

const ECWT_TABLE = 'ecwt_single_table';



// Example usage of putItemToDynamoDB
// (async () => {
//     try {
        // const putParams = {
        //     TableName: ECWT_TABLE,
        //     Item: {
        //         PK: 'user#testuser1@globe.com.ph',
        //         SK: 'user#testuser1@globe.com.ph',
        //         type: 'user',
        //         status: 'inactive',
        //         name: 'Test user 1',
        //         age: 30
        //     }
        // };
        // await putItemToDynamoDB(putParams);

        // const getParams = {
        //     TableName: ECWT_TABLE,
        //     Key: {
        //         PK: 'user#1',
        //         SK: 'meta#data'
        //     }
        // };

        // const item = await getItemFromDynamoDB(getParams);
        // console.log("Fetched item:", item);

        // const listParams = {
        //     TableName: ECWT_TABLE
        // };
        // const items = await listItemsInDynamoDB(listParams);
        // console.log("List of items:", items);

//     } catch (error) {
//         console.error("Error during DynamoDB operations:", error);
//     }
// })();


// batch
(async () => {
    try {
        const items = [
            {
                PK: 'user#wmadiano@globe.com.ph',
                SK: 'user#wmadiano@globe.com.ph',
                type: 'user',
                status: 'active',
                name: 'Wind Stoner',
                password_salt: '98999',
                password: 'hashedpawd',
                last_login:'2024-09-30',
                otp:'1122',
                otp_expiry:'2024-09-30'
            },
            {
                PK: 'user#jdoe@globe.com.ph',
                SK: 'user#jdoe@globe.com.ph',
                type: 'user',
                status: 'active',
                name: 'Jane Doe',
                password_salt: '98990',
                password: 'hashedpawdgf',
                last_login:'2024-09-30',
                otp:'1123',
                otp_expiry:'2024-09-30'
            },
            {
                PK: 'user#rsmith@globe.com.ph',
                SK: 'user#rsmith@globe.com.ph',
                type: 'user',
                status: 'inactive',
                name: 'Robert Smith',
                password_salt: '98991',
                password: 'hashedpawdgfjkjk',
                last_login:'2024-09-30',
                otp:'1234',
                otp_expiry:'2024-09-30'
            },
            {
                PK: 'company#1',
                SK: 'company#1',
                type: 'company',
                status: 'active',
                name: 'Company1',
                tin: '11122233344444'
            },
            {
                PK: 'company#2',
                SK: 'company#2',
                type: 'company',
                status: 'active',
                name: 'Company2',
                tin: '11122233344445'
            },
            {
                PK: 'company#1',
                SK: 'user#rsmith@globe.com.ph',
                type: 'user_company_role',
                role: 'Preparer'
            },
            {
                PK: 'company#2',
                SK: 'user#rsmith@globe.com.ph',
                type: 'user_company_role',
                role: 'Preparer',
            },
            {
                PK: 'company#1',
                SK: 'user#jdoe@globe.com.ph',
                type: 'user_company_role',
                role: 'Approver'
            },
            {
                PK: 'company#2',
                SK: 'user#jdoe@globe.com.ph',
                type: 'user_company_role',
                role: 'Approver',
            }
            
        ];

        await batchWriteItemsToDynamoDB(ECWT_TABLE, items);
    } catch (error) {
        console.error("Error during batch write to DynamoDB:", error);
    }
})();


// node ./src/services/userService.js