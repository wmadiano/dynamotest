// src/services/testDataRetrieve.js


const { DynamoDBDocumentClient, QueryCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient } = require('./aws/dynamoDbService'); // Import your existing DynamoDB document client

const ECWT_TABLE = 'ecwt_single_table';

// Get all users by company ID
async function getUsersForCompany(companyId) {
    try {
        const params = {
            TableName: ECWT_TABLE,
            KeyConditionExpression: '#pk = :companyId AND begins_with(#sk, :userPrefix)',
            ExpressionAttributeNames: {
                '#pk': 'PK',
                '#sk': 'SK',
            },
            ExpressionAttributeValues: {
                ':companyId': `company#${companyId}`,
                ':userPrefix': 'user#',
            },
        };

        const command = new QueryCommand(params);
        const response = await docClient.send(command);
        return response.Items || [];
    } catch (error) {
        console.error('Error retrieving users for company:', error);
        throw error;
    }
}


// Get all users by company ID
async function getUsersForCompany(companyId) {
    try {
        const params = {
            TableName: ECWT_TABLE,
            KeyConditionExpression: '#pk = :companyId AND begins_with(#sk, :userPrefix)',
            ExpressionAttributeNames: {
                '#pk': 'PK',
                '#sk': 'SK',
            },
            ExpressionAttributeValues: {
                ':companyId': `company#${companyId}`,
                ':userPrefix': 'user#',
            },
        };

        const command = new QueryCommand(params);
        const response = await docClient.send(command);
        return response.Items || [];
    } catch (error) {
        console.error('Error retrieving users for company:', error);
        throw error;
    }
}

// Example usage:
(async () => {
    try {
        const users = await getUsersForCompany(1);
        console.log('Users for company#1:', users);
    } catch (error) {
        console.error('Failed to retrieve users:', error);
    }
})();

// run
// node ./src/services/testDataInsert.js