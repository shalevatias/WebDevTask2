import mongoose, { Document, Types } from 'mongoose';
export interface IComment extends Document {
    postId: Types.ObjectId;
    owner: Types.ObjectId;
    text: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IComment, {}, {}, {}, mongoose.Document<unknown, {}, IComment, {}, {}> & IComment & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=commentModel.d.ts.map