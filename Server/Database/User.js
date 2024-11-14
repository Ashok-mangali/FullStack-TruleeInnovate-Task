const express = require('express');
const mongoose = require('mongoose')

const cors = require('cors');

const app = express();

app.use(cors()); 


const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    Phone: { type: Number, required: true },
    Email: { type: String, required: true },
    Gender: { type: String, required: true },
    Experience: { type: String, required: true },
    Skill: { type: String, required: true },

});

const UserModel = mongoose.model("users", UserSchema)
module.exports = UserModel

// student
// 2003
// mongodb+srv://student:<2003>@ashok.8bncr.mongodb.net/?retryWrites=true&w=majority&appName=ASHOK

// const { MongoClient } = require("mongodb");

// async function createDatabaseAndInsertData() {
//   const uri = "mongodb+srv://student:2003@ashok.8bncr.mongodb.net/?retryWrites=true&w=majority&appName=ASHOK";
//   const client = new MongoClient(uri);

//   try {
//     // Connect to MongoDB
//     await client.connect();
//     console.log("Connected to MongoDB");

//     // Specify the database and collection
//     const database = client.db("Candidate");  // This is your new database name
//     const collection = database.collection("Information"); // This is your collection name

//     // Insert a sample document
//     const document = {
//       Name : "Ashok",
//       Phone :" 1234567890",
//       Email : "assh123@gmailcom",
//       Gender : "Male",
//       Experience : "1-Year",
//       Skill : "IT"
//     };

//     const result = await collection.insertOne(document);
//     console.log(`New document inserted with _id: ${result.insertedId}`);
//     console.log("Database and collection created if they did not already exist.");
//   } catch (error) {
//     console.error("Error creating database or inserting data:", error);
//   } finally {
//     // Close the connection
//     await client.close();
//   }
// }

// createDatabaseAndInsertData().catch(console.error);
