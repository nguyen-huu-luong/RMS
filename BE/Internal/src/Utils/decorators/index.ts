import { NextFunction, Request, Response } from "express";

export function LogRequests(target: any) {
	const originalConstructor = target;
	// Iterate through all methods in the class
	for (const methodName of Object.getOwnPropertyNames(target.prototype)) {
		const descriptor = Object.getOwnPropertyDescriptor(
			target.prototype,
			methodName
		);

		// Check if it's a method
		if (descriptor && typeof descriptor.value === "function") {
			const originalMethod = descriptor.value;

			// Override the method with a new method that includes logging
			descriptor.value = async function (
				req: Request,
				res: Response,
				next: NextFunction
			) {
				console.log(`Incoming request to ${methodName}`);
				const url: string = req.url;
				const method: string = req.method;
				const host: string = req.headers.host as string;
				const ip: string = req.ip as string;
				const currentDate: Date = new Date()
				let currentTime: string = currentDate.toTimeString()
				const pos: number = currentTime.indexOf('GMT')

				currentTime = currentTime.substring(0, pos - 1);
				
				console.log(`${currentTime} | ${method} ${url} ${host} ${ip}`);
				// Execute the original method
				const result = await originalMethod.apply(this, [req, res, next]);

				// Log the result
				console.log(`Result of ${methodName}:`, result);
				return result;
			};

			// Apply the modified descriptor to the class prototype
			Object.defineProperty(target.prototype, methodName, descriptor);
		}
	}
}

export function AddTryCatchBlock(target: any) {
	const originalConstructor = target;
	// Iterate through all methods in the class
	for (const methodName of Object.getOwnPropertyNames(target.prototype)) {
		const descriptor = Object.getOwnPropertyDescriptor(
			target.prototype,
			methodName
		);

		// Check if it's a method
		if (descriptor && typeof descriptor.value === "function") {
			const originalMethod = descriptor.value;

			descriptor.value = async function (
				req: Request,
				res: Response,
				next: NextFunction
			) {
				try {
					const result = await originalMethod.apply(this, [req, res, next]);
					return result;
				} catch (error) {
					console.log(error)
					next(error)
				}
			};
			// Apply the modified descriptor to the class prototype
			Object.defineProperty(target.prototype, methodName, descriptor);
		}
	}
}