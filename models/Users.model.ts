import { Schema, model } from "mongoose";

export const userSchema = new Schema({
  username: { type: Schema.Types.String, unique: true },
  uuid: { type: Schema.Types.String, unique: true },
  isPublic: { type: Schema.Types.Boolean, default: true },
  image: Schema.Types.Buffer,
});

const UserModel = model("users", userSchema);
export default UserModel;
