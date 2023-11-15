abstract class BaseError {
	constructor(
		public code: number,
		public name: string,
		public message: string,
		public stackTrace?: string
	) {}

	public toPlainObject(): object {
		if (process.env.NODE_ENV === "development") {
			return {
				code: this.code,
				name: this.name,
				message: this.message,
				stackTrace: this.stackTrace,
			};
		}

		return {
			code: this.code,
			name: this.name,
			message: this.message,
		};
	}
}

export { BaseError };
