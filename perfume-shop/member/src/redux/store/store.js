import { configureStore } from '@reduxjs/toolkit';
import ProductSlice from '../slices/ProductSlice';
import LimitedOfferSlice from '../slices/LimitedOfferSlice';
import SaleSlice from '../slices/SaleSlice';
import BannerSlice from '../slices/BannerSlice';
import ReviewSlice from '../slices/ReviewSlice';

export const store = configureStore({
  reducer: {
    ProductSlice: ProductSlice,
    LimitedOfferSlice: LimitedOfferSlice,
    SaleSlice: SaleSlice,
    BannerSlice: BannerSlice,
    ReviewSlice: ReviewSlice
  }
});
