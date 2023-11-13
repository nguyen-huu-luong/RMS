import { NextFunction, Request, Response } from "express";
import { container } from "../Configs";
import { IClientRepository } from "../Repositories/IClientRepository";
import { TYPES } from "../Repositories/type";
import { Client } from "../Models";
import { Password, Token } from "../Utils";
import { ClientType, TOKEN_EXPIRE_IN} from "../Constants";

export class AuthService {
	constructor(
		private clientRepository = container.get<IClientRepository>(
			TYPES.IClientRepository
		),
		private EmployeeRepository = container.get<IClientRepository>(
			TYPES.IClientRepository
		)
	) {}

	public userLogin = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		const { email, password } = req.body;

		// check email and password are present
		if (!email || !password) {
			const message =
				(!password && "Password must be present!") ||
				(!email && "Email must be present!");
			res.send({
				success: false,
				msg: message,
			});
		}

		try {
			let user = await this.clientRepository.findByEmail(email);
			if (!user) {
				res.send({
					success: false,
					msg: "User not exists!",
				});
			} else {
				if (!user.isRegistered) {
					res.send({
						success: false,
						msg: "User not exists!",
					});
					return;
				}

				const isCorrectPassword = user.checkPassword(password);
				if (!isCorrectPassword) {
					res.send({
						success: false,
						msg: "Incorrect password",
					});
				} else {
					const token = Token.sign(user, TOKEN_EXPIRE_IN);
					res.send({
						success: true,
						token,
						user,
					});
				}
			}

			//
		} catch (err) {
			console.log(err);
		}
	};
	public usersignUp = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		const { firstname, lastname, email, password } = req.body;
		// check request body parameters
		if (!firstname || !lastname || !email || !password) {
			const message =
				(!firstname && "Firstname is required!") ||
				(!lastname && "Lastname is required!") ||
				(!email && "Email is required!") ||
				(!password && "Password is required!");
			res.send({
                success: false,
                msg: message
            })
			return;
		}

		try {
			const user = await this.clientRepository.findByEmail(email)

			if (user) {
                if (user.isRegistered) {
                    res.send({
                        success: false,
                        msg: "User was existed!"
                    })
                } else {
                    user.update({isRegisterd: true})
                    res.send({
                        success: true,
                        msg: "Create user successfully!"
                    })
                }
			} else {
                const hashedPassword = await Password.hash(password)
                const user = this.clientRepository.create({
                    email,
                    firstname,
                    lastname,
                    hashedPassword,
                    isRegistered: true,
                    type: ClientType.LEAD,
                })

                res.send({
                    success: true,
                    msg: "Create user successfully!"
                })
			}
		} catch (err) {
			console.log(err);
			next(err);
		}
	};

	public adminLogin = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {};

	public logout = async (req: Request, res: Response, next: NextFunction) => {};

	public refreshToken = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {};
}

