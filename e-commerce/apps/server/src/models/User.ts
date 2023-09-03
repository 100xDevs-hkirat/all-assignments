import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    username: string,
    password: string,
}

const userSchema = new Schema({
    username: { type: String, required: true, unique: true, trim: true, minlength: 3 },
    password: { type: String, required: true, trim: true, minlength: 3 },
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;