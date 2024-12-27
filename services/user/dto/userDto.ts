import { InferSchemaType } from "mongoose";
import { userSchema } from "../../../models/Users.model";

export type UserDto = InferSchemaType<typeof userSchema>;
