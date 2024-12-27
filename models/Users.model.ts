import { Schema, model } from "mongoose";

export const userSchema = new Schema({
  username: { type: Schema.Types.String, unique: true },
  isPublic: Schema.Types.Boolean,
  image: Schema.Types.Buffer,
});

const UserModel = model("users", userSchema);
export default UserModel;
