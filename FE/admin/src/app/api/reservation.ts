'use client'
import axios from 'axios';
import { mutate } from 'swr';
import { useRouter } from 'next/navigation';
import { request } from 'https';

export const resFetcher = async (sub_path: string, token: any) => {
    try {
        let url = `${process.env.BASE_URL}/${sub_path}`
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
        return response.json();
    } catch (error) {
        console.log(error)
    }
};


export const filterReservation = async (token: any, start_day: any, end_day: any, table_id: any, status: any) => {
    try {
        let url = `${process.env.BASE_URL}/reservations?start=${start_day}&end=${end_day}&table=${table_id}&status=${status}`
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
        return response.data;
    } catch (error) {
        console.log(error)
    }
}

export const createTable = async (token: any, table_name_: any, floor_name_: any) => {
    try {
        let url = `${process.env.BASE_URL}/tables`
        console.log(table_name_)
        console.log(floor_name_)
        let request_body = {
            floor_name: floor_name_,
            table_name: table_name_
        }
        const response = await axios.post(url, request_body, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
        return response.data;
    } catch (error) {
        console.log(error)
    }
}

export const createFloor = async (token: any, floor_name_: any) => {
    try {
        let url = `${process.env.BASE_URL}/floors`
        let request_body = {
            floor_name: floor_name_,
        }
        const response = await axios.post(url, request_body, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
        return response.data;
    } catch (error) {
        console.log(error)
    }
}

const deleteFloor = async (token: any, floor_names_: any) => {
    try {
        let url = `${process.env.BASE_URL}/floors`
        let request_body = {
            floor_names: floor_names_,
        }
        const response = await axios.delete(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            data: {
                request_body
            }
        })
        return response.data;
    } catch (error) {
        console.log(error)
    }
}

const deleteTable = async (token: any, table_names_: any) => {
    try {
        let url = `${process.env.BASE_URL}/tables`
        let request_body = {
            table_names: table_names_,
        }
        const response = await axios.delete(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            data: {
                request_body
            }
        })
        return response.data;
    } catch (error) {
        console.log(error)
    }
}


export const deleteItem = async (token: any, type_: any, data: any) => {
    try {
        let result: any
        if (type_ == "floor") {
            result = await deleteFloor(token, data)
        }
        else {
            result = await deleteTable(token, data)
        } 

        return result
    } catch (error) {
        console.log(error)
    }

}
export const updateReservationStatus = async (requestBody: any, id: string,token: any) => {
    try {
        const response = await axios.put(`${process.env.BASE_URL}/reservations?id=${id}`, requestBody, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
        return response.data;
    } catch (error) {
        console.log(error)
    }
}

export const deleteReservation = async (token: any, res_id: any) => {
    try {
        let url = `${process.env.BASE_URL}/reservations?id=${res_id}`
        const response = await axios.delete(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })
        return response.data;
    } catch (error) {
        console.log(error)
    }
}

export const createReservation = async (token: any, request_body: any) => {
    try {
        let url = `${process.env.BASE_URL}/reservations`
        const response = await axios.post(url, request_body, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
        return response.data;
    } catch (error) {
        console.log(error)
    }
}

export const updateReservationDetail = async (token: any, request_body: any) => {
    try {
        const response = await axios.put(`${process.env.BASE_URL}/reservations/all`, request_body, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
        return response.data;
    } catch (error) {
        console.log(error)
    }
}