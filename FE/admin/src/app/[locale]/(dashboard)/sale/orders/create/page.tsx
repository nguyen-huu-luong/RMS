import { PlusOutlined } from "@ant-design/icons";

const CreateOrder = () => {
    return (
        <div>
            <form className="w-full">
                <div className="mb-4">
                    <button className="btn btn-active font-medium px-2">CANCEL</button>
                    <button className="btn btn-active btn-primary ml-4  font-medium">SAVE</button>
                </div>
                <div className="w-full items-center bg-white py-2  px-10  rounded border">
                    <div className="grid grid-cols-2 gap-9 w-full">
                        <div >
                            <label htmlFor="first-name" className="block text-sm font-semibold leading-6 text-gray-900 pb-1">
                                First name (*)
                            </label>
                            <input
                                type="text"
                                name="first-name"
                                id="first-name"
                                className="block w-full rounded-md border-0 py-1.5 pl-3 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 focus:outline-none peer"
                                placeholder="First name"
                                style={{ backgroundColor: "#F6FAFD" }}
                            />
                        </div>
                        <div>
                            <label htmlFor="last-name" className="block text-sm font-semibold leading-6 text-gray-900 pb-1">
                                Last name (*)
                            </label>
                            <input
                                type="text"
                                name="last-name"
                                id="last-name"
                                className="block w-full rounded-md border-0 py-1.5 pl-3 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 focus:outline-none peer"
                                placeholder="Last name"
                                style={{ backgroundColor: "#F6FAFD" }}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-9 w-full mt-3">
                        <div >
                            <label htmlFor="email" className="block text-sm font-semibold leading-6 text-gray-900 pb-1">
                                Email
                            </label>
                            <input
                                type="text"
                                name="email"
                                id="email"
                                className="block w-full rounded-md border-0 py-1.5 pl-3 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 focus:outline-none peer"
                                placeholder="example@gmail.com"
                                style={{ backgroundColor: "#F6FAFD" }}
                            />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-semibold leading-6 text-gray-900 pb-1">
                                Phone (*)
                            </label>
                            <input
                                type="text"
                                name="phone"
                                id="phone"
                                className="block w-full rounded-md border-0 py-1.5 pl-3 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 focus:outline-none peer"
                                placeholder="Phone number"
                                style={{ backgroundColor: "#F6FAFD" }}
                            />
                        </div>
                    </div>
                    <div className="mt-3">
                        <label htmlFor="note" className="block text-sm font-semibold leading-6 text-gray-900 pb-1">
                            Note
                        </label>
                        <input
                            type="text"
                            name="email"
                            id="email"
                            className="block w-full rounded-md border-0 py-1.5 pl-3 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 focus:outline-none peer"
                            style={{ backgroundColor: "#F6FAFD" }}
                        />
                    </div>
                    <div className="mt-3 flex justify-between">
                        <p className="block text-sm font-semibold leading-6 text-gray-900 pb-1">Item</p>
                        <div className="inline-block cursor-pointer"><PlusOutlined /></div>
                    </div>

                </div>
            </form>
        </div>
    )
}

export default CreateOrder