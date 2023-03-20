import bcrypt from "bcrypt";

console.log(bcrypt.hashSync("user123", 10));
