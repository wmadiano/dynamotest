// src/services/testDataInsert.js

const {
    putItemToDynamoDB,
    getItemFromDynamoDB,
    listItemsInDynamoDB,
    batchWriteItemsToDynamoDB
} = require('./aws/dynamoDbService'); // Adjust the path based on your project structure

const ECWT_TABLE = 'ecwt_single_table';


// batch
(async () => {
    try {
        const items = [
            {
                PK: 'user#wmadiano@globe.com.ph',
                SK: 'user#wmadiano@globe.com.ph',
                type: 'user',
                id: 'wmadiano@globe.com.ph',
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
                id: 'user#jdoe@globe.com.ph',
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
                id: 'rsmith@globe.com.ph',
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
                id: '1',
                status: 'active',
                name: 'Company1',
                tin: '11122233344444'
            },
            {
                PK: 'company#2',
                SK: 'company#2',
                type: 'company',
                id: '2',
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

// run
// node ./src/services/testDataInsert.js