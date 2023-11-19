import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Product } from "../models/";

export const fetchProducts = createAsyncThunk(
    "user/fetchAll",
    async (_, thunkApi) => {
        try {
            const res = await axios.get<Product[]>(
                `http://localhost:3003/api/products/all`
            );
            return res.data;
        } catch (error) {
            return thunkApi.rejectWithValue("Something went wrong : ");
        }
    }
);
