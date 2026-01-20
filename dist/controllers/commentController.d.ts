import { Request, Response } from 'express';
export declare const createComment: (req: Request, res: Response) => Promise<void>;
export declare const getComments: (_req: Request, res: Response) => Promise<void>;
export declare const getComment: (req: Request, res: Response) => Promise<void>;
export declare const getCommentsByPost: (req: Request, res: Response) => Promise<void>;
export declare const updateComment: (req: Request, res: Response) => Promise<void>;
export declare const deleteComment: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=commentController.d.ts.map