import { NextFunction, Request, Response } from "express";
import { Token } from "../Utils";

class AuthMiddleware {
    public async verifyToken (
        req: Request,
        res: Response,
        next: NextFunction
    ){
        let token =
            req.body["token"] ||
            req.query["token"] ||
            req.headers.x_authorization ||
            req.headers.authorization  || "";
        if (token.startsWith("Bearer ")) {
            token = token.split(" ")[1];
        }

        try {
            const decoded = await Token.verify(token) 
            console.log(decoded) ;
        } catch (error: any) {
            res.send({
                success: false,
                message: error?.message || "Something went wrong!"
            })
        }        
    };
}


export default new AuthMiddleware();