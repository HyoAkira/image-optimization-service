import { InferSchemaType, Schema, model } from "mongoose";

export const userSchema = new Schema({
  username: { type: Schema.Types.String, unique: true },
  uuid: { type: Schema.Types.String, unique: true },
  tckn: { type: Schema.Types.String, unique: true },
  isPublic: { type: Schema.Types.Boolean, default: true },
  image: Schema.Types.Buffer,
});
export type UserDto = InferSchemaType<typeof userSchema>;

const UserModel = model("denemetest", userSchema);
export default UserModel;
