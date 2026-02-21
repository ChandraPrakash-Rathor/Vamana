import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from "axios";
import { baseUrl } from './config';

 export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (data) => {
        let url = baseUrl+'login';
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
  
