import { Schema, model, InferSchemaType } from "mongoose";
//bir tokenin birden fazla ipsi olabilir
export const securitySchema = new Schema({
  token: { type: Schema.Types.String, unique: true },
  ip: [{ type: Schema.Types.String }],
});

export type securityDTO = InferSchemaType<typeof securitySchema>;
const SecurityModel = model("security", securitySchema);
export default SecurityModel;
