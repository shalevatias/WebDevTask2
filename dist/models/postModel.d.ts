import mongoose, { Document, Types } from 'mongoose';
export interface IPost extends Document {
    owner: Types.ObjectId;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IPost, {}, {}, {}, mongoose.Document<unknown, {}, IPost, {}, {}> & IPost & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=postModel.d.ts.map