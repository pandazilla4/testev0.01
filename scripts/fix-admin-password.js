import bcrypt from "bcryptjs"

// Hash the admin password correctly
const password = "ADMIN2025"
const saltRounds = 10

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error("Error hashing password:", err)
  } else {
    console.log("Hashed password for ADMIN2025:")
    console.log(hash)
    console.log("\nUse this hash in the database update query.")
  }
})
