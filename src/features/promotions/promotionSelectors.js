export const selectActivePromotions = (state) => state.promotions?.activePromotions || [];
export const selectAdminPromotions = (state) => state.promotions?.adminPromotions || [];
export const selectPromotionLoading = (state) => state.promotions?.loading || false;
