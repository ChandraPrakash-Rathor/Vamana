import { configureStore } from '@reduxjs/toolkit';
import ProductSlice from '../slices/ProductSlice';
import LimitedOfferSlice from '../slices/LimitedOfferSlice';
import SaleSlice from '../slices/SaleSlice';
import BannerSlice from '../slices/BannerSlice';
import ReviewSlice from '../slices/ReviewSlice';
import AuthSlice from '../slices/AuthSlice';
import CartSlice from '../slices/CartSlice';
import CouponSlice from '../slices/CouponSlice';
import ThemeSlice from '../slices/ThemeSlice';
import OrderSlice from "../slices/OrderSlice";

export const store = configureStore({
  reducer: {
    ProductSlice: ProductSlice,
    LimitedOfferSlice: LimitedOfferSlice,
    SaleSlice: SaleSlice,
    BannerSlice: BannerSlice,
    ReviewSlice: ReviewSlice,
    AuthSlice: AuthSlice,
    CartSlice: CartSlice,
    CouponSlice: CouponSlice,
    ThemeSlice: ThemeSlice,
     OrderSlice: OrderSlice 
  }
});
