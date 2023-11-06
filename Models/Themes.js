import { Schema, model } from 'mongoose';

const ThemesSchema = new Schema(
  {
    name: { type: String, required: true },
  },
);

const JokesThemes = model('jokes_themes', ThemesSchema);

export default JokesThemes;
