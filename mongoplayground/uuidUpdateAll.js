// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use("local");
const crypto = require("crypto")

async function generateUUIDs() {


    try {




        // Retrieve all users
        const users = await db.getCollection("users").find({}).toArray();

        // Update each user with a new UUID
        for (const user of users) {
            const uuid = crypto.randomUUID();
            const hash = crypto.createHash("md5").update(uuid).digest("hex");

            await db.getCollection("users").updateOne(
                { _id: user._id }, // Filter by the user's unique ID
                { $set: { uuid: hash } } // Set the new UUID
            );
        }

        console.log("UUIDs successfully generated and updated!");
    } catch (error) {
        console.error("Error updating UUIDs:", error);
    } finally {
        await client.close();
    }
}

generateUUIDs();