// src/services/aws/dynamoDbService.js

require('dotenv').config();
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, GetCommand, ScanCommand, BatchWriteCommand } = require('@aws-sdk/lib-dynamodb');

function createDynamoDBClient() {
    const isLocal = process.env.AWS_LOCAL === 'true';

    if (isLocal) {
        return new DynamoDBClient({
            region: process.env.AWS_REGION,
            // endpoint: process.env.AWS_DYNAMODB_ENDPOINT || 'http://localhost:8000', // Default for local DynamoDB
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
            }
        });
    } else {
        return new DynamoDBClient({
            region: process.env.AWS_REGION || 'ap-southeast-1', // Default region
            // No credentials block, allowing IAM Role from EKS or EC2 to be assumed
        });
    }
}

// Create DynamoDB Client
const ddbClient = createDynamoDBClient();
const docClient = DynamoDBDocumentClient.from(ddbClient);

// Function to put a single item into DynamoDB
async function putItemToDynamoDB(params) {
    try {
        if (!params || !params.TableName || !params.Item) {
            throw new Error("Invalid parameters for putItem");
        }

        const command = new PutCommand(params);
        const response = await docClient.send(command);
        console.log("Item successfully added:", response);
        return response;
    } catch (error) {
        console.error("Error adding item to DynamoDB:", error);
        throw error;
    }
}

// Function to get an item from DynamoDB
async function getItemFromDynamoDB(params) {
    try {
        if (!params || !params.TableName || !params.Key) {
            throw new Error("Invalid parameters for getItem");
        }

        const command = new GetCommand(params);
        const response = await docClient.send(command);
        if (!response.Item) {
            console.warn("Item not found");
            return null; // Return null to indicate item not found
        }
        return response.Item;
    } catch (error) {
        console.error("Error fetching item from DynamoDB:", error);
        throw error;
    }
}

// Function to list items from DynamoDB
async function listItemsInDynamoDB(params) {
    try {
        if (!params || !params.TableName) {
            throw new Error("Invalid parameters for listItems");
        }

        const command = new ScanCommand(params);
        const response = await docClient.send(command);
        return response.Items || [];
    } catch (error) {
        console.error("Error listing items from DynamoDB:", error);
        throw error;
    }
}

// Function to batch write items to DynamoDB
async function batchWriteItemsToDynamoDB(tableName, items) {
    if (!tableName || !items || !Array.isArray(items) || items.length === 0) {
        throw new Error("Invalid parameters for batchWriteItems");
    }

    // Split items into batches of 25 items (maximum allowed by BatchWriteCommand)
    const batches = [];
    while (items.length) {
        batches.push(items.splice(0, 25));
    }

    for (const batch of batches) {
        const params = {
            RequestItems: {
                [tableName]: batch.map(item => ({
                    PutRequest: {
                        Item: item
                    }
                }))
            }
        };

        try {
            const command = new BatchWriteCommand(params);
            const response = await docClient.send(command);
            console.log("Batch write response:", response);

            // Handle unprocessed items if any
            if (response.UnprocessedItems && Object.keys(response.UnprocessedItems).length > 0) {
                console.warn("Some items were not processed, retry logic may be needed:", response.UnprocessedItems);
            }
        } catch (error) {
            console.error("Error in batch writing items to DynamoDB:", error);
            throw error;
        }
    }
}

module.exports = {
    ddbClient,
    docClient,
    putItemToDynamoDB,
    getItemFromDynamoDB,
    listItemsInDynamoDB,
    batchWriteItemsToDynamoDB
};
