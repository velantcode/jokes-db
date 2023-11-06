import { Schema, model } from 'mongoose';

const UsersSchema = new Schema(
  {
    name: { type: String, required: true },
  }
);

const Users = model('users', UsersSchema);

export default Users;
