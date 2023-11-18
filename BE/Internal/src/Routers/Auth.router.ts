import { NextFunction, Request, Response, Router } from "express";
import {AuthController} from "../Controllers";
import { AuthMiddleware, AuthValidators } from "../Middlewares";

class AuthRouter {
    // protected authController : AuthController;
    constructor() {
    } 
    
    public initialize() {
        const authController = new AuthController()
        const router = Router()
        router.post('/admin/signin', AuthValidators.adminLoginValidator, authController.adminLogin)
        router.post('/signin', AuthValidators.loginValidator, authController.userLogin)
        router.post('/signup', AuthValidators.signUpValidator, authController.usersignUp)
        router.post('/refresh', authController.refreshToken)
        router.delete('/logout', AuthMiddleware.initialize, authController.logout)
        router.delete('/logout/all', AuthMiddleware.initialize, authController.logoutAllDevices)
        return router ;
    }
}

export default AuthRouter ;