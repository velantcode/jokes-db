import { Schema, model } from 'mongoose';

const JokesSchema = new Schema(
  {
    title: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    themes: { type: [Schema.Types.ObjectId], ref: 'jokes_themes', required: true },
  },
);

const Jokes = model('jokes', JokesSchema);

export default Jokes;
