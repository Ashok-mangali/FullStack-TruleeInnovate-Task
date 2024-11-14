const mongoose = require("mongoose");
const express = require("express");
const cors = require('cors');

const app = express();
app.use(cors());

app.use(express.json()); 


mongoose.connect('mongodb+srv://student:2003@ashok.8bncr.mongodb.net/?retryWrites=true&w=majority&appName=ASHOK/Profile', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("MongoDB connection error:", err));


const UserSchema = new mongoose.Schema({
  name: String,
  Phone: Number,
  Email: String,
  Gender : String,
  Experience : String,
  Skill : String

},{ versionKey: false });

const UserModel = mongoose.model("users", UserSchema);

//  fetch users
app.get("/users", (req, res) => {
  UserModel.find({})
    .then((users) => {
      console.log("Fetched users:", users); 
      res.json(users);
    })
    .catch((err) => {
      console.error("Error fetching users:", err);
      res.status(500).send("Error fetching users");
    });
});


// POST method to add a new user
app.post("/users/add", (req, res) => {
    const newUser = new UserModel(req.body); 
    newUser.save() 
      .then((user) => {
        console.log("User added:", user);
        
        
        const userWithoutVersionKey = user.toObject({ versionKey: false });
        
        res.status(201).json(userWithoutVersionKey); 
      })
      .catch((err) => {
        console.error("Error adding user:", err);
        res.status(500).send("Error adding user");
      });
  });
  
  
//Update the users
  app.put("/users/:id", async (req, res) => {
    const { id } = req.params;  
    console.log("Received PUT request with ID:", id);  

    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log("Invalid ID format:", id);  
        return res.status(400).send("Invalid user ID format");
    }

    const updatedData = req.body;  
    console.log("Received updated data:", updatedData);  

    try {
       
        const updatedUser = await UserModel.findByIdAndUpdate(
            id,  
            updatedData,  
            { new: true, runValidators: true }  
        );

        
        if (!updatedUser) {
            console.log("User not found with ID:", id);
            return res.status(404).send("User not found");
        }

        console.log("User updated:", updatedUser);  
        res.json(updatedUser);  
    } catch (err) {
        console.error("Error updating user:", err);  
        res.status(500).send("Error updating user");
    }
});

  
// DELETE method to delete a user by ID
app.delete("/users/:id", (req, res) => {
  const userId = req.params.id;

  UserModel.findByIdAndDelete(userId)
    .then((user) => {
      if (user) {
        console.log("User deleted:", user);
        res.json({ message: "User deleted successfully" });
      } else {
        res.status(404).send("User not found");
      }
    })
    .catch((err) => {
      console.error("Error deleting user:", err);
      res.status(500).send("Error deleting user");
    });
});

// Start server
app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
