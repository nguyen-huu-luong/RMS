import { UsergroupAddOutlined, TableOutlined, CloseSquareOutlined, CheckSquareOutlined, FileSearchOutlined, PlusOutlined } from '@ant-design/icons';

function Home() {
    let reservation_data = ["10/10/2023", "10/11/2023", "20/12/2023"]
    let reservation_detail = [1, 2, 3, 4]
    return (
        <>
            <div className="flex" style={{ height: "100%", paddingBottom: "10px" }}>
                <div className="flex-1 pt-2 bg-white" >
                    <div>
                        <h2 className="font-semibold text-lg text-center">Reservations</h2>
                        <div className=" w-4/5  m-auto px-3 mt-3">
                            <form>
                                <div className="flex mt-2 justify-between">
                                    <div className="flex" >
                                        <label className="pr-3 font-semibold text-sm">From</label>
                                        <input type="date" className="text-sm rounded-md border-0 py-1 pl-2 pr-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400" style={{ outline: "0" }}></input>
                                    </div>
                                    <div className="flex">
                                        <label className="pr-3 font-semibold text-sm">To</label>
                                        <input type="date" className="text-sm rounded-md border-0 py-1 pl-2 pr-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400" style={{ outline: "0" }} ></input>
                                    </div>
                                </div>
                                <div className="flex mt-2 justify-between">
                                    <div className="flex">
                                        <button type="button" className="p-1 px-1 text-sm rounded border-0" style={{ color: "white", backgroundColor: "#4A58EC" }}>Search</button>
                                    </div>
                                    <div className="flex">
                                        <select className="rounded-md py-1.5 pl-1 pr-1 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 text-sm" style={{ outline: "0" }} name="source" defaultValue={"none"}>
                                            <option value={"none"} hidden>Table</option>
                                            <option value={"1"}>Table 1</option>
                                            <option value={"2"}>Table 2</option>
                                            <option value={"3"}>Table 3</option>
                                            <option value={"4"}>Table 4</option>
                                        </select>
                                    </div>
                                </div>
                            </form>
                            <div className="mt-3">
                                <hr></hr>
                            </div>
                            <div className='mt-3' style={{ maxHeight: "500px", overflowY: "auto" }}>
                                {
                                    reservation_data.map((item) => {
                                        return (<>
                                            <div className="mt-4 px-2 text-sm pb-3">
                                                <p className="text-center rounded font-semibold" style={{ backgroundColor: "#8DF185" }}>{item}</p>

                                                {
                                                    reservation_detail.map((item_) => {
                                                        return (
                                                            <>
                                                                <div className='flex justify-between pl-2 border-black mt-3 m-auto' style={{ width: "260px", borderWidth: "1px" }}>
                                                                    <div className='flex justify-around' style={{ width: "100%" }}>
                                                                        <div className='relative'>
                                                                            <div className='inline-block absolute' style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                                                                                <p className='text-center'>02:00</p>
                                                                                <p className='text-center'>PM</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className='flex'>
                                                                            <div className='px-2 border-black' style={{ paddingTop: "10px", paddingBottom: "10px", borderWidth: "0px 0px 0px 1px" }}>
                                                                                <div className='flex justify-between'>
                                                                                    <div><UsergroupAddOutlined /> <span className="text-sm">2</span> </div>
                                                                                    <div><TableOutlined /> <span className="text-sm">T1, T2</span> </div>
                                                                                </div>
                                                                                <div>
                                                                                    <p>Customer: John Nguyen</p>
                                                                                </div>
                                                                            </div>

                                                                        </div>
                                                                    </div>
                                                                    <div className=' pr-1'>
                                                                        <div><FileSearchOutlined style={{ color: "#4A58EC" }} /></div>
                                                                        <div><CheckSquareOutlined style={{ color: "#54B435" }} /></div>
                                                                        <div><CloseSquareOutlined style={{ color: "#DB3A34" }} /></div>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        )
                                                    })
                                                }



                                            </div>
                                        </>)
                                    })
                                }
                                {/* <div className="mt-4 px-2 text-sm pb-3">
                                    <p className="text-center rounded font-semibold" style={{ backgroundColor: "#8DF185" }}>10/10/2023</p>
                                    <div className='flex justify-between pl-2 border-black mt-3 m-auto' style={{ width: "260px", borderWidth: "1px" }}>
                                        <div className='flex justify-around' style={{ width: "100%" }}>
                                            <div className='relative'>
                                                <div className='inline-block absolute' style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                                                    <p className='text-center'>02:00</p>
                                                    <p className='text-center'>PM</p>
                                                </div>
                                            </div>
                                            <div className='flex'>
                                                <div className='px-2 border-black' style={{ paddingTop: "10px", paddingBottom: "10px", borderWidth: "0px 0px 0px 1px" }}>
                                                    <div className='flex justify-between'>
                                                        <div><UsergroupAddOutlined /> <span className="text-sm">2</span> </div>
                                                        <div><TableOutlined /> <span className="text-sm">T1, T2</span> </div>
                                                    </div>
                                                    <div>
                                                        <p>Customer: John Nguyen</p>
                                                    </div>
                                                </div>

                                            </div>

                                        </div>

                                        <div className=' pr-1'>
                                            <div><FileSearchOutlined style={{ color: "#4A58EC" }} /></div>
                                            <div><CheckSquareOutlined style={{ color: "#54B435" }} /></div>
                                            <div><CloseSquareOutlined style={{ color: "#DB3A34" }} /></div>
                                        </div>
                                    </div>






                                    <div className='flex justify-between pl-2 border-black mt-3 m-auto' style={{ width: "260px", borderWidth: "1px" }}>
                                        <div className='flex justify-around' style={{ width: "100%" }}>
                                            <div className='relative'>
                                                <div className='inline-block absolute' style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                                                    <p className='text-center'>02:00</p>
                                                    <p className='text-center'>PM</p>
                                                </div>
                                            </div>
                                            <div className='flex'>
                                                <div className='px-2 border-black' style={{ paddingTop: "10px", paddingBottom: "10px", borderWidth: "0px 0px 0px 1px" }}>
                                                    <div className='flex justify-between'>
                                                        <div><UsergroupAddOutlined /> <span className="text-sm">2</span> </div>
                                                        <div><TableOutlined /> <span className="text-sm">T1, T2</span> </div>
                                                    </div>
                                                    <div>
                                                        <p>Customer: John Nguyen</p>
                                                    </div>
                                                </div>

                                            </div>

                                        </div>

                                        <div className=' pr-1'>
                                            <div><FileSearchOutlined style={{ color: "#4A58EC" }} /></div>
                                            <div><CheckSquareOutlined style={{ color: "#54B435" }} /></div>
                                            <div><CloseSquareOutlined style={{ color: "#DB3A34" }} /></div>
                                        </div>
                                    </div>
                                    <div className='flex justify-between pl-2 border-black mt-3 m-auto' style={{ width: "260px", borderWidth: "1px" }}>
                                        <div className='flex justify-around' style={{ width: "100%" }}>
                                            <div className='relative'>
                                                <div className='inline-block absolute' style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                                                    <p className='text-center'>02:00</p>
                                                    <p className='text-center'>PM</p>
                                                </div>
                                            </div>
                                            <div className='flex'>
                                                <div className='px-2 border-black' style={{ paddingTop: "10px", paddingBottom: "10px", borderWidth: "0px 0px 0px 1px" }}>
                                                    <div className='flex justify-between'>
                                                        <div><UsergroupAddOutlined /> <span className="text-sm">2</span> </div>
                                                        <div><TableOutlined /> <span className="text-sm">T1, T2</span> </div>
                                                    </div>
                                                    <div>
                                                        <p>Customer: John Nguyen</p>
                                                    </div>
                                                </div>

                                            </div>

                                        </div>

                                        <div className=' pr-1'>
                                            <div><FileSearchOutlined style={{ color: "#4A58EC" }} /></div>
                                            <div><CheckSquareOutlined style={{ color: "#54B435" }} /></div>
                                            <div><CloseSquareOutlined style={{ color: "#DB3A34" }} /></div>
                                        </div>
                                    </div>
                                    <div className='flex justify-between pl-2 border-black mt-3 m-auto' style={{ width: "260px", borderWidth: "1px" }}>
                                        <div className='flex justify-around' style={{ width: "100%" }}>
                                            <div className='relative'>
                                                <div className='inline-block absolute' style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                                                    <p className='text-center'>02:00</p>
                                                    <p className='text-center'>PM</p>
                                                </div>
                                            </div>
                                            <div className='flex'>
                                                <div className='px-2 border-black' style={{ paddingTop: "10px", paddingBottom: "10px", borderWidth: "0px 0px 0px 1px" }}>
                                                    <div className='flex justify-between'>
                                                        <div><UsergroupAddOutlined /> <span className="text-sm">2</span> </div>
                                                        <div><TableOutlined /> <span className="text-sm">T1, T2</span> </div>
                                                    </div>
                                                    <div>
                                                        <p>Customer: John Nguyen</p>
                                                    </div>
                                                </div>

                                            </div>

                                        </div>

                                        <div className=' pr-1'>
                                            <div><FileSearchOutlined style={{ color: "#4A58EC" }} /></div>
                                            <div><CheckSquareOutlined style={{ color: "#54B435" }} /></div>
                                            <div><CloseSquareOutlined style={{ color: "#DB3A34" }} /></div>
                                        </div>
                                    </div>
                                    <div className='flex justify-between pl-2 border-black mt-3 m-auto' style={{ width: "260px", borderWidth: "1px" }}>
                                        <div className='flex justify-around' style={{ width: "100%" }}>
                                            <div className='relative'>
                                                <div className='inline-block absolute' style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                                                    <p className='text-center'>02:00</p>
                                                    <p className='text-center'>PM</p>
                                                </div>
                                            </div>
                                            <div className='flex'>
                                                <div className='px-2 border-black' style={{ paddingTop: "10px", paddingBottom: "10px", borderWidth: "0px 0px 0px 1px" }}>
                                                    <div className='flex justify-between'>
                                                        <div><UsergroupAddOutlined /> <span className="text-sm">2</span> </div>
                                                        <div><TableOutlined /> <span className="text-sm">T1, T2</span> </div>
                                                    </div>
                                                    <div>
                                                        <p>Customer: John Nguyen</p>
                                                    </div>
                                                </div>

                                            </div>

                                        </div>

                                        <div className=' pr-1'>
                                            <div><FileSearchOutlined style={{ color: "#4A58EC" }} /></div>
                                            <div><CheckSquareOutlined style={{ color: "#54B435" }} /></div>
                                            <div><CloseSquareOutlined style={{ color: "#DB3A34" }} /></div>
                                        </div>
                                    </div>



                                </div>


                                <div className="mt-4 px-2 text-sm pb-3">
                                    <p className="text-center rounded font-semibold" style={{ backgroundColor: "#8DF185" }}>10/10/2023</p>
                                    <div className='flex justify-between pl-2 border-black mt-3 m-auto' style={{ width: "260px", borderWidth: "1px" }}>
                                        <div className='flex justify-around' style={{ width: "100%" }}>
                                            <div className='relative'>
                                                <div className='inline-block absolute' style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                                                    <p className='text-center'>02:00</p>
                                                    <p className='text-center'>PM</p>
                                                </div>
                                            </div>
                                            <div className='flex'>
                                                <div className='px-2 border-black' style={{ paddingTop: "10px", paddingBottom: "10px", borderWidth: "0px 0px 0px 1px" }}>
                                                    <div className='flex justify-between'>
                                                        <div><UsergroupAddOutlined /> <span className="text-sm">2</span> </div>
                                                        <div><TableOutlined /> <span className="text-sm">T1, T2</span> </div>
                                                    </div>
                                                    <div>
                                                        <p>Customer: John Nguyen</p>
                                                    </div>
                                                </div>

                                            </div>

                                        </div>

                                        <div className=' pr-1'>
                                            <div><FileSearchOutlined style={{ color: "#4A58EC" }} /></div>
                                            <div><CheckSquareOutlined style={{ color: "#54B435" }} /></div>
                                            <div><CloseSquareOutlined style={{ color: "#DB3A34" }} /></div>
                                        </div>
                                    </div>






                                    <div className='flex justify-between pl-2 border-black mt-3 m-auto' style={{ width: "260px", borderWidth: "1px" }}>
                                        <div className='flex justify-around' style={{ width: "100%" }}>
                                            <div className='relative'>
                                                <div className='inline-block absolute' style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                                                    <p className='text-center'>02:00</p>
                                                    <p className='text-center'>PM</p>
                                                </div>
                                            </div>
                                            <div className='flex'>
                                                <div className='px-2 border-black' style={{ paddingTop: "10px", paddingBottom: "10px", borderWidth: "0px 0px 0px 1px" }}>
                                                    <div className='flex justify-between'>
                                                        <div><UsergroupAddOutlined /> <span className="text-sm">2</span> </div>
                                                        <div><TableOutlined /> <span className="text-sm">T1, T2</span> </div>
                                                    </div>
                                                    <div>
                                                        <p>Customer: John Nguyen</p>
                                                    </div>
                                                </div>

                                            </div>

                                        </div>

                                        <div className=' pr-1'>
                                            <div><FileSearchOutlined style={{ color: "#4A58EC" }} /></div>
                                            <div><CheckSquareOutlined style={{ color: "#54B435" }} /></div>
                                            <div><CloseSquareOutlined style={{ color: "#DB3A34" }} /></div>
                                        </div>
                                    </div>
                                    <div className='flex justify-between pl-2 border-black mt-3 m-auto' style={{ width: "260px", borderWidth: "1px" }}>
                                        <div className='flex justify-around' style={{ width: "100%" }}>
                                            <div className='relative'>
                                                <div className='inline-block absolute' style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                                                    <p className='text-center'>02:00</p>
                                                    <p className='text-center'>PM</p>
                                                </div>
                                            </div>
                                            <div className='flex'>
                                                <div className='px-2 border-black' style={{ paddingTop: "10px", paddingBottom: "10px", borderWidth: "0px 0px 0px 1px" }}>
                                                    <div className='flex justify-between'>
                                                        <div><UsergroupAddOutlined /> <span className="text-sm">2</span> </div>
                                                        <div><TableOutlined /> <span className="text-sm">T1, T2</span> </div>
                                                    </div>
                                                    <div>
                                                        <p>Customer: John Nguyen</p>
                                                    </div>
                                                </div>

                                            </div>

                                        </div>

                                        <div className=' pr-1'>
                                            <div><FileSearchOutlined style={{ color: "#4A58EC" }} /></div>
                                            <div><CheckSquareOutlined style={{ color: "#54B435" }} /></div>
                                            <div><CloseSquareOutlined style={{ color: "#DB3A34" }} /></div>
                                        </div>
                                    </div>
                                    <div className='flex justify-between pl-2 border-black mt-3 m-auto' style={{ width: "260px", borderWidth: "1px" }}>
                                        <div className='flex justify-around' style={{ width: "100%" }}>
                                            <div className='relative'>
                                                <div className='inline-block absolute' style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                                                    <p className='text-center'>02:00</p>
                                                    <p className='text-center'>PM</p>
                                                </div>
                                            </div>
                                            <div className='flex'>
                                                <div className='px-2 border-black' style={{ paddingTop: "10px", paddingBottom: "10px", borderWidth: "0px 0px 0px 1px" }}>
                                                    <div className='flex justify-between'>
                                                        <div><UsergroupAddOutlined /> <span className="text-sm">2</span> </div>
                                                        <div><TableOutlined /> <span className="text-sm">T1, T2</span> </div>
                                                    </div>
                                                    <div>
                                                        <p>Customer: John Nguyen</p>
                                                    </div>
                                                </div>

                                            </div>

                                        </div>

                                        <div className=' pr-1'>
                                            <div><FileSearchOutlined style={{ color: "#4A58EC" }} /></div>
                                            <div><CheckSquareOutlined style={{ color: "#54B435" }} /></div>
                                            <div><CloseSquareOutlined style={{ color: "#DB3A34" }} /></div>
                                        </div>
                                    </div>
                                    <div className='flex justify-between pl-2 border-black mt-3 m-auto' style={{ width: "260px", borderWidth: "1px" }}>
                                        <div className='flex justify-around' style={{ width: "100%" }}>
                                            <div className='relative'>
                                                <div className='inline-block absolute' style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                                                    <p className='text-center'>02:00</p>
                                                    <p className='text-center'>PM</p>
                                                </div>
                                            </div>
                                            <div className='flex'>
                                                <div className='px-2 border-black' style={{ paddingTop: "10px", paddingBottom: "10px", borderWidth: "0px 0px 0px 1px" }}>
                                                    <div className='flex justify-between'>
                                                        <div><UsergroupAddOutlined /> <span className="text-sm">2</span> </div>
                                                        <div><TableOutlined /> <span className="text-sm">T1, T2</span> </div>
                                                    </div>
                                                    <div>
                                                        <p>Customer: John Nguyen</p>
                                                    </div>
                                                </div>

                                            </div>

                                        </div>

                                        <div className=' pr-1'>
                                            <div><FileSearchOutlined style={{ color: "#4A58EC" }} /></div>
                                            <div><CheckSquareOutlined style={{ color: "#54B435" }} /></div>
                                            <div><CloseSquareOutlined style={{ color: "#DB3A34" }} /></div>
                                        </div>
                                    </div>



                                </div> */}
                            </div>

                        </div>
                        <div>

                        </div>
                    </div>
                </div>
                <div className="flex-1 pt-1" style={{ paddingLeft: "100px", paddingRight: "100px" }} >
                    <div className='flex justify-between' style={{ width: "60%" }} >
                        <div>
                            <button type="button" className="p-1 px-1 text-sm rounded border-0" style={{ color: "white", backgroundColor: "#4A58EC" }}>Reserve</button>
                        </div>
                        <div>
                            <button type="button" className="p-1 px-1 text-sm rounded border-0" style={{ color: "white", backgroundColor: "#4A58EC" }}>Create floor</button>
                        </div>
                        <div>
                            <button type="button" className="p-1 px-1 text-sm rounded border-0" style={{ color: "white", backgroundColor: "#DB3A34" }}>Delete</button>
                        </div>
                    </div>

                    <div className='mt-3' style={{maxHeight: "600px", overflowY: "auto"}}>

                    <div className='mt-5 text-sm pb-4'>
                        <div>
                            <div className='flex justify-between bg-orange-200 py-1 px-2 rounded' style={{width: "98%"}}>
                                <div>
                                    <p className='font-semibold '>1st floor</p>
                                </div>
                                <div>
                                    <PlusOutlined />
                                </div>
                            </div>

                          
                            <div className='mt-4 px-3'>
                                <div className='grid grid-cols-4 gap-y-8   '>
                                    <div className='bg-white rounded relative' style={{ width: "75px", height: "75px", borderWidth: "2px" }}>
                                        <p className='text-white bg-black inline-block px-3 rounded-lg font-semibold absolute' style={{ fontSize: "10px", bottom: "-20px", left: "50%", transform: "translate(-50%, -50%)" }}>T1</p>
                                        <div className='inline-block absolute' style={{ right: "-10px", top: "-10px" }}>
                                            <div className='bg-black relative' style={{ borderRadius: "180px", borderWidth: "1px", borderStyle: "solid", width: "23px", height: "23px" }}>
                                                <p className='text-white font-semibold absolute' style={{ fontSize: "10px", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>T1</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='bg-white rounded relative' style={{ width: "75px", height: "75px", borderWidth: "2px" }}>
                                        <p className='text-white bg-black inline-block px-3 rounded-lg font-semibold absolute' style={{ fontSize: "10px", bottom: "-20px", left: "50%", transform: "translate(-50%, -50%)" }}>T1</p>
                                        <div className='inline-block absolute' style={{ right: "-10px", top: "-10px" }}>
                                            <div className='bg-black relative' style={{ borderRadius: "180px", borderWidth: "1px", borderStyle: "solid", width: "23px", height: "23px" }}>
                                                <p className='text-white font-semibold absolute' style={{ fontSize: "10px", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>T1</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='bg-white rounded relative' style={{ width: "75px", height: "75px", borderWidth: "2px" }}>
                                        <p className='text-white bg-black inline-block px-3 rounded-lg font-semibold absolute' style={{ fontSize: "10px", bottom: "-20px", left: "50%", transform: "translate(-50%, -50%)" }}>T1</p>
                                        <div className='inline-block absolute' style={{ right: "-10px", top: "-10px" }}>
                                            <div className='bg-black relative' style={{ borderRadius: "180px", borderWidth: "1px", borderStyle: "solid", width: "23px", height: "23px" }}>
                                                <p className='text-white font-semibold absolute' style={{ fontSize: "10px", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>T1</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='bg-white rounded relative' style={{ width: "75px", height: "75px", borderWidth: "2px" }}>
                                        <p className='text-white bg-black inline-block px-3 rounded-lg font-semibold absolute' style={{ fontSize: "10px", bottom: "-20px", left: "50%", transform: "translate(-50%, -50%)" }}>T1</p>
                                        <div className='inline-block absolute' style={{ right: "-10px", top: "-10px" }}>
                                            <div className='bg-black relative' style={{ borderRadius: "180px", borderWidth: "1px", borderStyle: "solid", width: "23px", height: "23px" }}>
                                                <p className='text-white font-semibold absolute' style={{ fontSize: "10px", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>T1</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='bg-white rounded relative' style={{ width: "75px", height: "75px", borderWidth: "2px" }}>
                                        <p className='text-white bg-black inline-block px-3 rounded-lg font-semibold absolute' style={{ fontSize: "10px", bottom: "-20px", left: "50%", transform: "translate(-50%, -50%)" }}>T1</p>
                                        <div className='inline-block absolute' style={{ right: "-10px", top: "-10px" }}>
                                            <div className='bg-black relative' style={{ borderRadius: "180px", borderWidth: "1px", borderStyle: "solid", width: "23px", height: "23px" }}>
                                                <p className='text-white font-semibold absolute' style={{ fontSize: "10px", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>T1</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='bg-white rounded relative' style={{ width: "75px", height: "75px", borderWidth: "2px" }}>
                                        <p className='text-white bg-black inline-block px-3 rounded-lg font-semibold absolute' style={{ fontSize: "10px", bottom: "-20px", left: "50%", transform: "translate(-50%, -50%)" }}>T1</p>
                                        <div className='inline-block absolute' style={{ right: "-10px", top: "-10px" }}>
                                            <div className='bg-black relative' style={{ borderRadius: "180px", borderWidth: "1px", borderStyle: "solid", width: "23px", height: "23px" }}>
                                                <p className='text-white font-semibold absolute' style={{ fontSize: "10px", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>T1</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className='mt-5 text-sm pb-4'>
                        <div>
                            <div className='flex justify-between bg-orange-200 py-1 px-2 rounded' style={{width: "98%"}}>
                                <div>
                                    <p className='font-semibold'>1st floor</p>
                                </div>
                                <div>
                                    <PlusOutlined />
                                </div>
                            </div>

                        
                            <div className='mt-4 px-3'>
                                <div className='grid grid-cols-4 gap-y-8  '>
                                    <div className='bg-white rounded relative' style={{ width: "75px", height: "75px", borderWidth: "2px" }}>
                                        <p className='text-white bg-black inline-block px-3 rounded-lg font-semibold absolute' style={{ fontSize: "10px", bottom: "-20px", left: "50%", transform: "translate(-50%, -50%)" }}>T1</p>
                                        <div className='inline-block absolute' style={{ right: "-10px", top: "-10px" }}>
                                            <div className='bg-black relative' style={{ borderRadius: "180px", borderWidth: "1px", borderStyle: "solid", width: "23px", height: "23px" }}>
                                                <p className='text-white font-semibold absolute' style={{ fontSize: "10px", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>T1</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='bg-white rounded relative' style={{ width: "75px", height: "75px", borderWidth: "2px" }}>
                                        <p className='text-white bg-black inline-block px-3 rounded-lg font-semibold absolute' style={{ fontSize: "10px", bottom: "-20px", left: "50%", transform: "translate(-50%, -50%)" }}>T1</p>
                                        <div className='inline-block absolute' style={{ right: "-10px", top: "-10px" }}>
                                            <div className='bg-black relative' style={{ borderRadius: "180px", borderWidth: "1px", borderStyle: "solid", width: "23px", height: "23px" }}>
                                                <p className='text-white font-semibold absolute' style={{ fontSize: "10px", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>T1</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='bg-white rounded relative' style={{ width: "75px", height: "75px", borderWidth: "2px" }}>
                                        <p className='text-white bg-black inline-block px-3 rounded-lg font-semibold absolute' style={{ fontSize: "10px", bottom: "-20px", left: "50%", transform: "translate(-50%, -50%)" }}>T1</p>
                                        <div className='inline-block absolute' style={{ right: "-10px", top: "-10px" }}>
                                            <div className='bg-black relative' style={{ borderRadius: "180px", borderWidth: "1px", borderStyle: "solid", width: "23px", height: "23px" }}>
                                                <p className='text-white font-semibold absolute' style={{ fontSize: "10px", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>T1</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='bg-white rounded relative' style={{ width: "75px", height: "75px", borderWidth: "2px" }}>
                                        <p className='text-white bg-black inline-block px-3 rounded-lg font-semibold absolute' style={{ fontSize: "10px", bottom: "-20px", left: "50%", transform: "translate(-50%, -50%)" }}>T1</p>
                                        <div className='inline-block absolute' style={{ right: "-10px", top: "-10px" }}>
                                            <div className='bg-black relative' style={{ borderRadius: "180px", borderWidth: "1px", borderStyle: "solid", width: "23px", height: "23px" }}>
                                                <p className='text-white font-semibold absolute' style={{ fontSize: "10px", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>T1</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='bg-white rounded relative' style={{ width: "75px", height: "75px", borderWidth: "2px" }}>
                                        <p className='text-white bg-black inline-block px-3 rounded-lg font-semibold absolute' style={{ fontSize: "10px", bottom: "-20px", left: "50%", transform: "translate(-50%, -50%)" }}>T1</p>
                                        <div className='inline-block absolute' style={{ right: "-10px", top: "-10px" }}>
                                            <div className='bg-black relative' style={{ borderRadius: "180px", borderWidth: "2px", borderStyle: "solid", width: "23px", height: "23px" }}>
                                                <p className='text-white font-semibold absolute' style={{ fontSize: "10px", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>T1</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='bg-white rounded relative' style={{ width: "75px", height: "75px", borderWidth: "2px" }}>
                                        <p className='text-white bg-black inline-block px-3 rounded-lg font-semibold absolute' style={{ fontSize: "10px", bottom: "-20px", left: "50%", transform: "translate(-50%, -50%)" }}>T1</p>
                                        <div className='inline-block absolute' style={{ right: "-10px", top: "-10px" }}>
                                            <div className='bg-black relative' style={{ borderRadius: "180px", borderWidth: "1px", borderStyle: "solid", width: "23px", height: "23px" }}>
                                                <p className='text-white font-semibold absolute' style={{ fontSize: "10px", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>T1</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>



                    <div className='mt-5 text-sm pb-4'>
                        <div>
                            <div className='flex justify-between bg-orange-200 py-1 px-2 rounded' style={{width: "98%"}}>
                                <div>
                                    <p className='font-semibold'>1st floor</p>
                                </div>
                                <div>
                                    <PlusOutlined />
                                </div>
                            </div>
                            <div className='mt-4 px-3'>
                                <div className='grid grid-cols-4 gap-y-8  '>
                                    <div className='bg-white rounded relative' style={{ width: "75px", height: "75px", borderWidth: "1px" }}>
                                        <p className='text-white bg-black inline-block px-3 rounded-lg font-semibold absolute' style={{ fontSize: "10px", bottom: "-20px", left: "50%", transform: "translate(-50%, -50%)" }}>T1</p>
                                        <div className='inline-block absolute' style={{ right: "-10px", top: "-10px" }}>
                                            <div className='bg-black relative' style={{ borderRadius: "180px", borderWidth: "1px", borderStyle: "solid", width: "23px", height: "23px" }}>
                                                <p className='text-white font-semibold absolute' style={{ fontSize: "10px", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>T1</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='bg-white rounded relative' style={{ width: "75px", height: "75px", borderWidth: "1px" }}>
                                        <p className='text-white bg-black inline-block px-3 rounded-lg font-semibold absolute' style={{ fontSize: "10px", bottom: "-20px", left: "50%", transform: "translate(-50%, -50%)" }}>T1</p>
                                        <div className='inline-block absolute' style={{ right: "-10px", top: "-10px" }}>
                                            <div className='bg-black relative' style={{ borderRadius: "180px", borderWidth: "1px", borderStyle: "solid", width: "23px", height: "23px" }}>
                                                <p className='text-white font-semibold absolute' style={{ fontSize: "10px", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>T1</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='bg-white rounded relative' style={{ width: "75px", height: "75px", borderWidth: "1px" }}>
                                        <p className='text-white bg-black inline-block px-3 rounded-lg font-semibold absolute' style={{ fontSize: "10px", bottom: "-20px", left: "50%", transform: "translate(-50%, -50%)" }}>T1</p>
                                        <div className='inline-block absolute' style={{ right: "-10px", top: "-10px" }}>
                                            <div className='bg-black relative' style={{ borderRadius: "180px", borderWidth: "1px", borderStyle: "solid", width: "23px", height: "23px" }}>
                                                <p className='text-white font-semibold absolute' style={{ fontSize: "10px", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>T1</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='bg-white rounded relative' style={{ width: "75px", height: "75px", borderWidth: "1px" }}>
                                        <p className='text-white bg-black inline-block px-3 rounded-lg font-semibold absolute' style={{ fontSize: "10px", bottom: "-20px", left: "50%", transform: "translate(-50%, -50%)" }}>T1</p>
                                        <div className='inline-block absolute' style={{ right: "-10px", top: "-10px" }}>
                                            <div className='bg-black relative' style={{ borderRadius: "180px", borderWidth: "1px", borderStyle: "solid", width: "23px", height: "23px" }}>
                                                <p className='text-white font-semibold absolute' style={{ fontSize: "10px", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>T1</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='bg-white rounded relative' style={{ width: "75px", height: "75px", borderWidth: "1px" }}>
                                        <p className='text-white bg-black inline-block px-3 rounded-lg font-semibold absolute' style={{ fontSize: "10px", bottom: "-20px", left: "50%", transform: "translate(-50%, -50%)" }}>T1</p>
                                        <div className='inline-block absolute' style={{ right: "-10px", top: "-10px" }}>
                                            <div className='bg-black relative' style={{ borderRadius: "180px", borderWidth: "1px", borderStyle: "solid", width: "23px", height: "23px" }}>
                                                <p className='text-white font-semibold absolute' style={{ fontSize: "10px", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>T1</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='bg-white rounded relative' style={{ width: "75px", height: "75px", borderWidth: "1px" }}>
                                        <p className='text-white bg-black inline-block px-3 rounded-lg font-semibold absolute' style={{ fontSize: "10px", bottom: "-20px", left: "50%", transform: "translate(-50%, -50%)" }}>T1</p>
                                        <div className='inline-block absolute' style={{ right: "-10px", top: "-10px" }}>
                                            <div className='bg-black relative' style={{ borderRadius: "180px", borderWidth: "1px", borderStyle: "solid", width: "23px", height: "23px" }}>
                                                <p className='text-white font-semibold absolute' style={{ fontSize: "10px", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>T1</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>



                    </div>

                </div>
            </div>
        </>
    );
}

export default Home;