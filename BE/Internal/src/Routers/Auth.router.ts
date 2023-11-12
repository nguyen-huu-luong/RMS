import { Router } from "express";
import {AuthController} from "../Controllers";

class AuthRouter {
    // protected authController : AuthController;
    constructor() {
    } 
    
    public initialize() {
        const authController = new AuthController()
        const router = Router()
        router.post('/signin', authController.userLogin)
        router.post('/signup', authController.usersignUp)
        router.delete('/logout', authController.logout)
        return router ;
    }
}

export default AuthRouter ;