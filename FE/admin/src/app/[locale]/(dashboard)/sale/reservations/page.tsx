'use client'
import React from 'react'
import axios from 'axios';
import { mutate } from 'swr';
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { resFetcher, filterReservation, createTable, createFloor, deleteItem, updateReservationStatus, deleteReservation, createReservation, updateReservationDetail } from '@/app/api/reservation';
import { useState, useEffect } from 'react';
import { UsergroupAddOutlined, TableOutlined, CloseSquareOutlined, CheckSquareOutlined, FileSearchOutlined, PlusOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { Button, Modal, Form, Input, type FormProps, notification, Select, DatePicker, TimePicker, InputNumber, } from 'antd';
import moment from "moment";
import dayjs from 'dayjs';

const Context = React.createContext({ name: 'Default' });

function Home() {

    const { data: session, status } = useSession();
    const [api, contextHolder] = notification.useNotification();
    const [deleteOption, setDeleteOption] = useState([])
    const dateFormat = "YYYY-MM-DD";
    const timeFormat = 'HH:mm';
    interface Dictionary {
        [Key: string]: string;
    }
    const [form_table] = Form.useForm();
    const [form_delete] = Form.useForm();
    const [form_floor] = Form.useForm();
    const [form_reservation_detail] = Form.useForm();
    const [checker, setChecker] = useState(true)
    const [messError, setMessError] = useState("")

    const { push } = useRouter();

    let reservationStatus: Dictionary = { "Waiting": "black", "Done": "#54B435", "Canceled": "#DB3A34" }

    const {
        data: resInfo,
        error: resInfoError,
        isLoading: resInfoLoading,
    } = useSWR(
        session
            ? [`reservations/all`, session.user.accessToken]
            : null,
        ([sub_path, token]) => resFetcher(sub_path, token)
    );


    const showDetailTable = (tableId: any) => {
        push(`/sale/reservations/${tableId}`);
    }

    const handelFilter = (filterFactor: any) => {
        resInfo.reservarions = {}
        setChecker((current_value) => !current_value)
    }

    const handelFilterFormal = async (event: any) => {
        event.preventDefault()
        let start_date = event.target.start_date.value
        let end_date = event.target.end_date.value
        let table_id = event.target.table_id.value
        let status = ""
        let data = await filterReservation(session?.user.accessToken, start_date, end_date, table_id, status)
        resInfo.reservarions = data.reservarions
        setChecker((current_value) => !current_value)
    }

    const handelFilterShortCut = async (table_id_: any) => {
        let start_date = ""
        let end_date = ""
        let table_id = table_id_
        let status = "Waiting"
        let data = await filterReservation(session?.user.accessToken, start_date, end_date, table_id, status)
        resInfo.reservarions = data.reservarions
        setChecker((current_value) => !current_value)
    }

    const handelCreateFloor: FormProps<FieldType>["onFinish"] = async (values) => {
        setMessError("")
        let floor_name_ = values.floor_name
        let data = await createFloor(session?.user.accessToken, floor_name_?.trim())
        if (data.status) {
            resInfo.floors = data.floors
            setIsModalFloorOpen(false);
            setChecker((current_value) => !current_value)
        }
        else {
            setMessError(data.message)
        }

    }

    const handelCreateTable: FormProps<FieldType>["onFinish"] = async (values) => {
        let table_name_ = values.table_name
        let floor_name_ = values.floor_name_temp
        setMessError("")
        let data = await createTable(session?.user.accessToken, table_name_?.trim(), floor_name_?.trim())
        if (data.status) {
            resInfo.floors = data.floors
            resInfo.tables = data.tables
            setIsModalTableOpen(false);
            setChecker((current_value) => !current_value)
        }
        else {
            setMessError(data.message)
        }

    }

    const handleUpdateReservationStatus = async (status: any, id: any) => {
        const data = await updateReservationStatus({"status": status },id, session?.user.accessToken)
        resInfo.floors = data.floors
        resInfo.tables = data.tables
        resInfo.reservarions = data.reservarions
        setChecker((current_value) => !current_value)
    }
    const [isModalTableOpen, setIsModalTableOpen] = useState(false);

    const showModalTable = (floor_name: any) => {
        form_table.setFieldsValue({ floor_name_temp: floor_name })
        setIsModalTableOpen(true);
    };


    const handleCanceModalTable = () => {
        form_table.setFieldsValue({ table_name: "" })
        setIsModalTableOpen(false);
        setMessError("")
    };

    const [isModalFloorOpen, setIsModalFloorOpen] = useState(false);

    const showModalFloor = () => {
        setIsModalFloorOpen(true);
    };


    const handleCanceModalFloor = () => {
        form_floor.setFieldsValue({ floor_name: "" })
        setIsModalFloorOpen(false);
        setMessError("")
    };

    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const handleDeleteItem = async (values: any) => {
        let item_names = values.item_name
        let item_type = values.item_type
        let data = await deleteItem(session?.user.accessToken, item_type, item_names)
        resInfo.floors = data.floors
        resInfo.reservarions = data.reservarions
        resInfo.tables = data.tables
        resInfo.table_reservations = data.table_reservations
        setChecker((current_value) => !current_value)
        setIsModalDeleteOpen(false);
    }

    const showModalDetete = () => {
        setIsModalDeleteOpen(true);
        form_delete.setFieldsValue({ item_type: "" })
        form_delete.setFieldsValue({ item_name: [] })
    };


    const handleCanceModalDelete = () => {
        form_delete.setFieldsValue({ item_type: "" })
        form_delete.setFieldsValue({ item_name: [] })

        setIsModalDeleteOpen(false);
        setMessError("")
    };


    const [isModalReservation, setIsModalReservationOpen] = useState(false);

    const showModalReservation = () => {
        form_reservation_detail.resetFields()
        setIsModalReservationOpen(true);
    };


    const handleCanceModalReservation = () => {
        setMessError("")
        setIsModalReservationOpen(false);
    };

    const handelChangeItemDeleteType = (type_: any) => {
        let arr: any
        if (type_ == "floor") {
            arr = Object.keys(resInfo.floors)
        }
        else {
            let arr_temp: Array<string> = []
            resInfo.tables.map((item: any) => arr_temp.push(item.name))
            arr = arr_temp
        }
        setDeleteOption(arr)
    }

    const handleCreateReservation = async (values: any) => {
        const start_time: any = values.start_time.format("HH:mm")
        const end_time: any = values.end_time.format("HH:mm")

        if (start_time > end_time) {
            setMessError("Start time must be less than end time")
        }
        else {
            const request_body: any = {
                "customerCount": values.quantity,
                "customerName": values.customer_name,
                "customerPhone": values.phone_number,
                "status": "Waiting",
                "dateTo": values.date_reserve.format("YYYY-MM-DD"),
                "timeTo": values.start_time.format("HH:mm"),
                "timeEnd": values.end_time.format("HH:mm"),
                "table_ids": values.table_reservation,
                "description": values.note,
            }
            const data = await createReservation(session?.user.accessToken, request_body)

            if(data.hasOwnProperty("message")) {
                setMessError(data["message"])
            }
            else {
                resInfo.floors = data.floors
                resInfo.reservarions = data.reservarions
                resInfo.tables = data.tables
                resInfo.table_reservations = data.table_reservations
                setChecker((current_value) => !current_value)
                setIsModalReservationOpen(false);
            }
        }
       
    }


    const [isModalReservationDetail, setIsModalReservationDetailOpen] = useState(false);

    const showModalReservationDetail = async (item: any) => {
        if (item.Tables) {
            let tables: Array<Number> = []
            await item.Tables.map((table: any) => tables.push(table.id))
            form_reservation_detail.setFieldsValue({customer_name: item.customerName})
            form_reservation_detail.setFieldsValue({phone_number: item.customerPhone})
            form_reservation_detail.setFieldsValue({quantity: item.customerCount})
            form_reservation_detail.setFieldsValue({table_reservation: tables})
            form_reservation_detail.setFieldsValue({date_reserve: moment(item.dateTo)})
            form_reservation_detail.setFieldsValue({start_time: dayjs(item.timeTo, timeFormat)})
            form_reservation_detail.setFieldsValue({end_time: dayjs(item.timeEnd, timeFormat)})
            form_reservation_detail.setFieldsValue({note: item.description})
            form_reservation_detail.setFieldsValue({status: item.status})
            form_reservation_detail.setFieldsValue({res_id: item.id})
            setIsModalReservationDetailOpen(true);
        }
    };


    const handleCanceModalReservationDetail = () => {
        setMessError("")
        setIsModalReservationDetailOpen(false);
    };

    const handleReservationDetail = async (values: any) => {
        const start_time: any = values.start_time.format("HH:mm")
        const end_time: any = values.end_time.format("HH:mm")

        if (start_time > end_time) {
            setMessError("Start time must be less than end time")
        }
        else {
            const request_body: any = {
                "res_id": values.res_id,
                "customerCount": values.quantity,
                "customerName": values.customer_name,
                "customerPhone": values.phone_number,
                "status": values.status,
                "dateTo": values.date_reserve.format("YYYY-MM-DD"),
                "timeTo": values.start_time.format("HH:mm"),
                "timeEnd": values.end_time.format("HH:mm"),
                "table_ids": values.table_reservation,
                "description": values.note,
            }
            const data = await updateReservationDetail(session?.user.accessToken, request_body)

            if(data.hasOwnProperty("message")) {
                setMessError(data["message"])
            }
            else {
                resInfo.floors = data.floors
                resInfo.reservarions = data.reservarions
                resInfo.tables = data.tables
                resInfo.table_reservations = data.table_reservations
                setChecker((current_value) => !current_value)
                setIsModalReservationDetailOpen(false);
            }
        }
    }

    const handelDeleteReservation = async () => {
        let res_id = form_reservation_detail.getFieldValue("res_id")
        let data = await deleteReservation(session?.user.accessToken, res_id)
        resInfo.floors = data.floors
        resInfo.reservarions = data.reservarions
        resInfo.tables = data.tables
        resInfo.table_reservations = data.table_reservations
        setChecker((current_value) => !current_value)
        setIsModalReservationDetailOpen(false);
    }

    type FieldType = {
        floor_name?: string;
        table_name?: string;
        floor_name_temp?: string;
        customer_name?: string;
        phone_number?: string;
        quantity?: number;
        note?: number,
        date_reserve?: any,
        status?: any,
        start_time?: any,
        end_time?: any,
        table_reservation?: any,
        item_type?: any,
        item_name?: any,
        res_id?: any
    };

    return (
        <>
            {
                resInfo ? <>
                    <div className="flex" style={{ height: "100%", paddingBottom: "10px" }}>
                        <div className="flex-1 pt-2 bg-white" >
                            <div>
                                <h2 className="font-semibold text-lg text-center">Reservations</h2>
                                <div className=" w-4/5  m-auto px-3 mt-3">
                                    <form onSubmit={(e) => handelFilterFormal(e)}>
                                        <div className="flex mt-2 justify-between">
                                            <div className="flex" >
                                                <label className="pr-3 font-semibold text-sm">From</label>
                                                <input type="date" className="text-sm rounded-md border-0 py-1 pl-2 pr-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400" style={{ outline: "0" }} name='start_date'></input>
                                            </div>
                                            <div className="flex">
                                                <label className="pr-3 font-semibold text-sm">To</label>
                                                <input type="date" className="text-sm rounded-md border-0 py-1 pl-2 pr-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400" style={{ outline: "0" }} name='end_date'></input>
                                            </div>
                                        </div>
                                        <div className="flex mt-2 justify-between">
                                            <div className="flex">
                                                <button className="p-1 px-1 text-sm rounded border-0" style={{ color: "white", backgroundColor: "#4A58EC" }}>Search</button>
                                            </div>
                                            <div className="flex">
                                                <select className="rounded-md py-1.5 pl-1 pr-1 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 text-sm" style={{ outline: "0" }} name="table_id" defaultValue={""}>
                                                    <option value={""} hidden>Table</option>
                                                    {
                                                        resInfo.tables.map((item: any) => <option value={item.id}>Table {item.name}</option>)
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                    </form>
                                    <div className="mt-3">
                                        <hr></hr>
                                    </div>
                                    <div className='mt-3' style={{ maxHeight: "500px", overflowY: "auto" }}>
                                        <Modal title="Reservation information detail" open={isModalReservationDetail} onCancel={handleCanceModalReservationDetail} footer={(_, { OkBtn, CancelBtn }) => (<></>)}>
                                            <Form form={form_reservation_detail} name="basic" onFinish={handleReservationDetail}>
                                                <div className='relative'>
                                                    <div className='flex justify-between'>
                                                        <div style={{ width: "48%" }}>
                                                            <p>
                                                                Customer name
                                                            </p>
                                                            <Form.Item<FieldType>
                                                                name="customer_name"
                                                                rules={[{ required: true, message: 'Please input the customer name !' }]}>
                                                                <Input />
                                                            </Form.Item>
                                                        </div>
                                                        <div style={{ width: "48%" }}>
                                                            <p>
                                                                Phone number
                                                            </p>
                                                            <Form.Item<FieldType>
                                                                name="phone_number"
                                                                rules={[{ required: true, message: 'Please input phone number !' }]}>
                                                                <Input />
                                                            </Form.Item>
                                                        </div>
                                                    </div>
                                                    <div className='flex justify-between'>
                                                        <div>
                                                            <p>
                                                                Date
                                                            </p>
                                                            <Form.Item name="date_reserve"
                                                                rules={[{ required: true, message: 'Please choose date !' }]}>
                                                                <DatePicker format={dateFormat}/>
                                                            </Form.Item>
                                                        </div>
                                                        <div>
                                                            <p>
                                                                Start time
                                                            </p>
                                                            <Form.Item name="start_time" rules={[{ required: true, message: 'Please choose start time !' }]}>
                                                                <TimePicker format={timeFormat}/>
                                                            </Form.Item>
                                                        </div>
                                                        <div>
                                                            <p>
                                                                End time
                                                            </p>
                                                            <Form.Item name="end_time" rules={[{ required: true, message: 'Please choose end time !' }]}>
                                                                <TimePicker format={timeFormat}/>
                                                            </Form.Item>
                                                        </div>
                                                    </div>
                                                    <div className='flex justify-between'>
                                                        <div style={{width: "48%"}}>
                                                            <p>
                                                                Quantity
                                                            </p>
                                                            <Form.Item name="quantity" rules={[{ required: true, message: 'Please input the quantity !' }]}>
                                                                <InputNumber min={1} style={{ width: "100%" }} />
                                                            </Form.Item>
                                                        </div>

                                                        <div style={{width: "48%"}}>
                                                            <p>
                                                                Status
                                                            </p>
                                                            <Form.Item name="status" rules={[{ required: true, message: 'Please choose reserved tables !' }]}>
                                                                <Select  allowClear>
                                                                <Select.Option value="Done">Done</Select.Option>
                                                                <Select.Option value="Waiting">Waiting</Select.Option>
                                                                <Select.Option value="Canceled">Canceled</Select.Option>
                                                                </Select>
                                                            </Form.Item>
                                                        </div>
                                                    </div>
                                                    <div >
                                                            <p>
                                                                Table
                                                            </p>
                                                            <Form.Item name="table_reservation" rules={[{ required: true, message: 'Please choose reserved tables !' }]}>
                                                                <Select mode="multiple" allowClear>
                                                                    {
                                                                        resInfo.tables.map((item: any) => <Select.Option value={item.id}>{item.name}</Select.Option>)
                                                                    }
                                                                </Select>
                                                            </Form.Item>
                                                        </div>
                                                    <div>
                                                        <p>
                                                            Note
                                                        </p>
                                                        <Form.Item<FieldType>
                                                            name="note">
                                                            <Input />
                                                        </Form.Item>
                                                    </div>
                                                    <div style={{display: "none"}}>
                                                    
                                                        <Form.Item<FieldType>
                                                            name="res_id">
                                                            <Input />
                                                        </Form.Item>
                                                    </div>
                                                    <p className='mt-0 text-center absolute' style={{ color: "#ff4d4f", bottom: "-22px", left: "50%", transform: "translateX(-50%)"  }}>{messError}</p>
                                                </div>
                                                <div >
                                                    <Form.Item >
                                                        <div className='flex justify-end' style={{ width: "100%" }}>
                                                            <div className='pr-3'>
                                                                <Button style={{ backgroundColor: "#4A58EC", color: "white" }} htmlType='submit'>CHANGE</Button>
                                                            </div>
                                                            <div>
                                                                <Button onClick={handelDeleteReservation} style={{ backgroundColor: "#DB3A34", color: "white" }} htmlType="button">DELETE</Button>
                                                            </div>
                                                        </div>
                                                    </Form.Item>
                                                </div>
                                            </Form>
                                        </Modal>
                                        {
                                            Object.keys(resInfo.reservarions).length == 0 ? <p className='text-center text-gray-400'>No data</p>
                                                : <>
                                                    {
                                                        Object.keys(resInfo.reservarions).map((key: any, index: any) => {
                                                            return (<>
                                                                <div className="mt-4 px-2 text-sm pb-3">
                                                                    <p className="text-center rounded font-semibold" style={{ backgroundColor: "#8DF185" }}>{key}</p>

                                                                    {
                                                                        resInfo.reservarions[key].map((item: any) => {
                                                                            return (
                                                                                <>
                                                                                    <div className='flex justify-between pl-2 border-black mt-3 m-auto' style={{ width: "280px", borderWidth: "1px", borderColor: reservationStatus[item.status] }}>
                                                                                        <div className='flex justify-around' style={{ width: "100%" }}>
                                                                                            <div className='relative' >
                                                                                                <div className='inline-block absolute' style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                                                                                                    <p className='text-center'>{item.timeTo.slice(0, 5)}</p>
                                                                                                    <p className='text-center font-bold p-0 m-0' style={{ fontSize: "10px" }}>to</p>
                                                                                                    <p className='text-center'>{item.timeEnd.slice(0, 5)}</p>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className='flex' style={{ width: "185px" }}>
                                                                                                <div className='px-2' style={{ paddingTop: "10px", paddingBottom: "10px", borderWidth: "0px 0px 0px 1px", borderColor: reservationStatus[item.status] }}>
                                                                                                    <div className='flex justify-between ' style={{ width: "170px" }}>
                                                                                                        <div><UsergroupAddOutlined /> <span className="text-sm">{item.customerCount}</span> </div>
                                                                                                        <div><TableOutlined /> <span className="text-sm">{resInfo.table_reservations[`${item.id}`]}</span> </div>
                                                                                                    </div>
                                                                                                    <div>
                                                                                                        <p>Customer: {item.customerName}</p>
                                                                                                    </div>
                                                                                                </div>

                                                                                            </div>

                                                                                        </div>
                                                                                        <div className=' pr-1 pt-1'>
                                                                                            <div><button onClick={()  => showModalReservationDetail(item)}><FileSearchOutlined style={{ color: "#4A58EC" }} /></button></div>
                                                                                            {
                                                                                                item.status == "Waiting" && <>
                                                                                                    <div><button onClick={() => handleUpdateReservationStatus("Done", item.id)}><CheckSquareOutlined style={{ color: "#54B435" }} /></button></div>
                                                                                                    <div><button onClick={() => handleUpdateReservationStatus("Canceled", item.id)}><CloseSquareOutlined style={{ color: "#DB3A34" }} /></button></div>
                                                                                                </>

                                                                                            }
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
                                                </>
                                        }
                                    </div>

                                </div>
                                <div>

                                </div>
                            </div>
                        </div>
                        <div className="flex-1 pt-1" style={{ paddingLeft: "100px", paddingRight: "100px" }} >
                            <div className='flex justify-between' style={{ width: "60%" }} >
                                <div>
                                    <button type="button" className="p-1 px-2 text-sm rounded border-0" style={{ color: "white", backgroundColor: "#4A58EC" }} onClick={showModalReservation}>Reserve</button>
                                    <Modal title="Reservation information form" open={isModalReservation} onCancel={handleCanceModalReservation} footer={(_, { OkBtn, CancelBtn }) => (<></>)}>
                                        <Form form={form_reservation_detail} name="basic" onFinish={handleCreateReservation}>
                                            <div className='relative'>
                                                <div className='flex justify-between'>
                                                    <div style={{ width: "48%" }}>
                                                        <p>
                                                            Customer name
                                                        </p>
                                                        <Form.Item<FieldType>
                                                            name="customer_name"
                                                            rules={[{ required: true, message: 'Please input the customer name !' }]}>
                                                            <Input />
                                                        </Form.Item>
                                                    </div>
                                                    <div style={{ width: "48%" }}>
                                                        <p>
                                                            Phone number
                                                        </p>
                                                        <Form.Item<FieldType>
                                                            name="phone_number"
                                                            rules={[{ required: true, message: 'Please input phone number !' }]}>
                                                            <Input />
                                                        </Form.Item>
                                                    </div>
                                                </div>
                                                <div className='flex justify-between'>
                                                    <div>
                                                        <p>
                                                            Date
                                                        </p>
                                                        <Form.Item name="date_reserve"
                                                            rules={[{ required: true, message: 'Please choose date !' }]}>
                                                            <DatePicker format={dateFormat}/>
                                                        </Form.Item>
                                                    </div>
                                                    <div>
                                                        <p>
                                                            Start time
                                                        </p>
                                                        <Form.Item name="start_time" rules={[{ required: true, message: 'Please choose start time !' }]}>
                                                            <TimePicker format={timeFormat}/>
                                                        </Form.Item>
                                                    </div>
                                                    <div>
                                                        <p>
                                                            End time
                                                        </p>
                                                        <Form.Item name="end_time" rules={[{ required: true, message: 'Please choose end time !' }]}>
                                                            <TimePicker format={timeFormat}/>
                                                        </Form.Item>
                                                    </div>
                                                </div>
                                                <div className='flex justify-between'>
                                                    <div style={{ width: "48%" }}>
                                                        <p>
                                                            Quantity
                                                        </p>
                                                        <Form.Item name="quantity" rules={[{ required: true, message: 'Please input the quantity !' }]}>
                                                            <InputNumber min={1} style={{ width: "100%" }} />
                                                        </Form.Item>
                                                    </div>
                                                    <div style={{ width: "48%" }}>
                                                        <p>
                                                            Table
                                                        </p>
                                                        <Form.Item name="table_reservation" rules={[{ required: true, message: 'Please choose reserved tables !' }]}>
                                                            <Select mode="multiple" allowClear>
                                                                {
                                                                    resInfo.tables.map((item: any) => <Select.Option value={item.id}>{item.name}</Select.Option>)
                                                                }
                                                            </Select>
                                                        </Form.Item>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p>
                                                        Note
                                                    </p>
                                                    <Form.Item<FieldType>
                                                        name="note">
                                                        <Input />
                                                    </Form.Item>
                                                </div>
                                                <p className='mt-0 text-center absolute' style={{ color: "#ff4d4f", bottom: "-22px", left: "50%", transform: "translateX(-50%)"  }}>{messError}</p>
                                            </div>
                                            <div >
                                                <Form.Item >
                                                    <div className='flex justify-end mt-3' style={{ width: "100%" }}>
                                                        <div className='pr-3'>
                                                            <Button style={{ backgroundColor: "#989898", color: "white" }} onClick={handleCanceModalReservation}>CANCEL</Button>
                                                        </div>
                                                        <div>
                                                            <Button style={{ backgroundColor: "#4A58EC", color: "white" }} htmlType="submit">CONFIRM</Button>
                                                        </div>
                                                    </div>
                                                </Form.Item>
                                            </div>
                                        </Form>
                                    </Modal>
                                </div>
                                <div>
                                    <button onClick={showModalFloor} type="button" className="p-1 px-2 text-sm rounded border-0" style={{ color: "white", backgroundColor: "#4A58EC" }}>Create floor</button>

                                    <Modal title="Floor" open={isModalFloorOpen} onCancel={handleCanceModalFloor} footer={(_, { OkBtn, CancelBtn }) => (<></>)}>
                                        <Form form={form_floor} name="basic" onFinish={handelCreateFloor}>
                                            <div >
                                                <div className='flex align-middle relative'>
                                                    <div className='relative' style={{ width: "100px" }}>
                                                        <p className='absolute' style={{ top: "5%" }}>Floor name:</p>
                                                    </div>
                                                    <div style={{ width: "90%" }}>
                                                        <Form.Item<FieldType>
                                                            name="floor_name"
                                                            rules={[{ required: true, message: 'Please input floor name !' }]}>
                                                            <Input style={{ width: "100%" }} onFocus={() => setMessError("")} />
                                                        </Form.Item>
                                                    </div>
                                                    <p className='mt-0 absolute' style={{ top: "55%", color: "#ff4d4f", left: "20%" }}>{messError}</p>
                                                </div>

                                                <div >
                                                    <Form.Item >
                                                        <div className='flex justify-end' style={{ width: "100%" }}>
                                                            <div className='pr-3'>
                                                                <Button style={{ backgroundColor: "#989898", color: "white" }} onClick={handleCanceModalFloor}>CANCEL</Button>
                                                            </div>
                                                            <div>
                                                                <Button style={{ backgroundColor: "#4A58EC", color: "white" }} htmlType="submit">CONFIRM</Button>
                                                            </div>
                                                        </div>
                                                    </Form.Item>
                                                </div>
                                            </div>
                                        </Form>
                                    </Modal>


                                </div>
                                <div>
                                    <button type="button" onClick={showModalDetete} className="p-1 px-2 text-sm rounded border-0" style={{ color: "white", backgroundColor: "#DB3A34" }}>Delete</button>
                                    <Modal title="Item option" open={isModalDeleteOpen} onCancel={handleCanceModalDelete} footer={(_, { OkBtn, CancelBtn }) => (<></>)}>
                                        <Form form={form_delete} name="delete" onFinish={handleDeleteItem} >
                                            <div >
                                                <div className='flex align-middle'>
                                                    <div className='relative' style={{ width: "100px" }}>
                                                        <p className='absolute' style={{ top: "5%" }}>Item type:</p>
                                                    </div>
                                                    <div style={{ width: "90%" }}>
                                                        <Form.Item name="item_type" rules={[{ required: true, message: 'Please choose item type!' }]}>
                                                            <Select onChange={(value) => handelChangeItemDeleteType(value)}>
                                                                <Select.Option value="floor">Floor</Select.Option>
                                                                <Select.Option value="table">Table</Select.Option>
                                                            </Select>
                                                        </Form.Item>
                                                    </div>


                                                </div>
                                                <div className='flex align-middle' style={{ marginTop: "0px" }}>
                                                    <div className='relative' style={{ width: "100px" }}>
                                                        <p className='absolute' style={{ top: "5%" }}>Name:</p>
                                                    </div>
                                                    <div style={{ width: "90%" }}>
                                                        <Form.Item name="item_name" rules={[{ required: true, message: 'Please choose item name!' }]}>
                                                            <Select mode="multiple" allowClear>
                                                                {
                                                                    deleteOption.map((item: any) => <Select.Option value={item}>{item}</Select.Option>)
                                                                }
                                                            </Select>
                                                        </Form.Item>
                                                    </div>


                                                </div>
                                                <div >
                                                    <Form.Item >
                                                        <div className='flex justify-end' style={{ width: "100%" }}>
                                                            <div className='pr-3'>
                                                                <Button style={{ backgroundColor: "#989898", color: "white" }} onClick={handleCanceModalDelete}>CANCEL</Button>
                                                            </div>
                                                            <div>
                                                                <Button style={{ backgroundColor: "#4A58EC", color: "white" }} htmlType="submit">CONFIRM</Button>
                                                            </div>
                                                        </div>
                                                    </Form.Item>
                                                </div>
                                            </div>
                                        </Form>
                                    </Modal>
                                </div>
                            </div>

                            <div className='mt-3' style={{ maxHeight: "600px", overflowY: "auto" }}>
                                <>
                                    <Modal title="Table" open={isModalTableOpen} onCancel={handleCanceModalTable} footer={(_, { OkBtn, CancelBtn }) => (<></>)}>
                                        <Form name="basic" form={form_table} onFinish={(values) => handelCreateTable(values)}>
                                            <div >
                                                <div className='flex align-middle'>
                                                    <div className='relative' style={{ width: "100px" }}>
                                                        <p className='absolute' style={{ top: "5%" }}>Table name:</p>
                                                    </div>
                                                    <div style={{ width: "90%" }}>
                                                        <Form.Item<FieldType>
                                                            name="table_name"
                                                            rules={[{ required: true, message: 'Please input table name !' }]}>
                                                            <Input style={{ width: "100%" }} onFocus={() => setMessError("")} />
                                                        </Form.Item>
                                                    </div>
                                                    <div style={{ width: "90%", display: "none" }}>
                                                        <Form.Item<FieldType>
                                                            name="floor_name_temp">
                                                            <Input style={{ width: "100%" }} />
                                                        </Form.Item>
                                                    </div>
                                                    <p className='mt-0 absolute' style={{ top: "46%", color: "#ff4d4f", left: "22%" }}>{messError}</p>
                                                </div>

                                                <div >
                                                    <Form.Item >
                                                        <div className='flex justify-end' style={{ width: "100%" }}>
                                                            <div className='pr-3'>
                                                                <Button style={{ backgroundColor: "#989898", color: "white" }} onClick={handleCanceModalTable}>CANCEL</Button>
                                                            </div>
                                                            <div>
                                                                <Button style={{ backgroundColor: "#4A58EC", color: "white" }} htmlType="submit">CONFIRM</Button>
                                                            </div>
                                                        </div>
                                                    </Form.Item>
                                                </div>
                                            </div>
                                        </Form>
                                    </Modal>
                                </>
                                {
                                    Object.keys(resInfo.floors).map((key: any, index: any) => {
                                        return (
                                            <>
                                                <div className='mt-5 text-sm pb-4'>
                                                    <div>
                                                        <div className='flex justify-between bg-orange-200 py-1 px-2 rounded' style={{ width: "98%" }}>
                                                            <div>
                                                                <p className='font-semibold '>{key} floor</p>
                                                            </div>
                                                            <div>
                                                                <button onClick={() => showModalTable(key)}>
                                                                    <PlusOutlined />
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div className='mt-4 px-3'>
                                                            <div className='grid grid-cols-4 gap-y-8   '>
                                                                {
                                                                    resInfo.floors[key].map((item: any) => {
                                                                        return (
                                                                            <>
                                                                                <div className='bg-white rounded relative' style={{ width: "75px", height: "75px", borderWidth: "2px" }}>

                                                                                    {
                                                                                        item.status == "Free" ? <p onClick={() => showDetailTable(item.id)} className='text-white bg-black inline-block px-3 rounded-lg font-semibold absolute' style={{ fontSize: "10px", bottom: "-20px", left: "50%", transform: "translate(-50%, -50%)", cursor: "pointer" }}>{item.name}</p>
                                                                                            : <p onClick={() => showDetailTable(item.id)} className='text-white  inline-block px-3 rounded-lg font-semibold absolute' style={{ fontSize: "10px", bottom: "-20px", left: "50%", transform: "translate(-50%, -50%)", backgroundColor: "#EA6A12", cursor: "pointer" }}>{item.name}</p>
                                                                                    }

                                                                                    {
                                                                                        item.numRes != 0 && <div className='inline-block absolute' style={{ right: "-10px", top: "-10px" }}>
                                                                                            <div className='bg-white relative' style={{ borderRadius: "180px", borderWidth: "1px", borderStyle: "solid", width: "23px", height: "23px", borderColor: "#54B435", cursor: "pointer" }} onClick={() => handelFilterShortCut(item.id)}>
                                                                                                <p className=' font-semibold absolute' style={{ fontSize: "10px", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>{item.numRes}</p>
                                                                                            </div>
                                                                                        </div>
                                                                                    }
                                                                                </div>
                                                                            </>
                                                                        )
                                                                    })
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )
                                    })
                                }

                            </div>

                        </div>
                    </div>
                </>
                    : <>
                        <p>Loading ...</p>
                    </>

            }
        </>
    );
}

export default Home;