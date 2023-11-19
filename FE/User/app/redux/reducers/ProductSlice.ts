import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../models";
import { fetchProducts } from "../services/";

interface ProductState {
    products: Product[];
    isLoading: boolean;
    error: string;
}

const initialState: ProductState = {
    products: [],
    isLoading: false,
    error: "",
};

export const productReducer = createSlice({
    name: "user",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(fetchProducts.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(
            fetchProducts.fulfilled,
            (state, action: PayloadAction<Product[]>) => {
                state.isLoading = false;
                state.error = "";
                state.products = action.payload;
            }
        );
        builder.addCase(
            fetchProducts.rejected,
            (state, action: PayloadAction<string | unknown>) => {
                state.isLoading = false;
                if (typeof action.payload === "string") {
                    state.error = action.payload;
                }
            }
        );
    },
});

export default productReducer.reducer;
