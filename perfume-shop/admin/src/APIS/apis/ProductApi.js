import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from "axios";
import { baseUrl } from './config';

 export const insertProduct = createAsyncThunk(
    'insertProduct',
    async (data) => {
        let url = baseUrl+'insertProduct';
      try {
        const response = (await axios.post(url,data)).data
        if(response.status === "success"){
            return Promise.resolve(response)
        } else if(response.status === "error"){
            return Promise.resolve(response)
        }else{
          return Promise.reject(response)
        }
      } catch (err) {

        return Promise.reject(err)
      }
    },
  );
  
  export const GetProduct = createAsyncThunk(
    'GetProduct',
    async () => {
        let url = baseUrl+'GetProducts';
      try {
        const response = (await axios.get(url)).data
        
        if(response.status === "success"){
            return Promise.resolve(response)
        } else if(response.status === "error"){
            return Promise.resolve(response)
        }else{
          return Promise.reject(response)
        }
      } catch (err) {
        return Promise.reject(err)
      }
    },
  );

  export const DeleteProduct = createAsyncThunk(
    'DeleteProduct',
    async (id) => {
        let url = baseUrl+`products/${id}`;
      try {
        const response = (await axios.delete(url)).data
        if(response.success === true){
            return Promise.resolve(response)
        } else if(response.success === false){
            return Promise.resolve(response)
        }else{
          return Promise.reject(response)
        }
      } catch (err) {
        return Promise.reject(err)
      }
    },
  );

  export const UpdateProduct = createAsyncThunk(
    'UpdateProduct',
    async ({ id, data }) => {
        let url = baseUrl+`products/${id}`;
      try {
        const response = (await axios.put(url, data)).data
        if(response.success === true){
            return Promise.resolve(response)
        } else if(response.success === false){
            return Promise.resolve(response)
        }else{
          return Promise.reject(response)
        }
      } catch (err) {
        return Promise.reject(err)
      }
    },
  );
