
import { configureStore } from '@reduxjs/toolkit'
import loginReducer  from '../slice/Authslice'
import  ProductReducer from '../slice/ProductSlice'
import  CouponReducer from '../slice/CouponSlice'
import  SaleReducer from '../slice/SaleSlice'
import  LimitedOfferReducer from '../slice/LimitedOfferSlice'
import  ReviewReducer from '../slice/ReviewSlice'
import  BannerReducer from '../slice/BannerSlice'
import  MemberReducer from '../slice/MemberSlice'
import  ThemeReducer from '../slice/ThemeSlice'
import  OrderReducer from '../slice/OrderSlice'
 

export const store = configureStore({
  reducer: {
    AuthSlice:loginReducer,
    ProductSlice:ProductReducer,
    CouponSlice:CouponReducer,
    SaleSlice:SaleReducer,
    LimitedOfferSlice:LimitedOfferReducer,
    ReviewSlice:ReviewReducer,
    BannerSlice:BannerReducer,
    MemberSlice:MemberReducer,
    ThemeSlice:ThemeReducer,
    OrderSlice:OrderReducer
  },
})
