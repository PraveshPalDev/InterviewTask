export const calculateDiscountedPrice = (price: number, discountPercentage: number = 0) => {
  return price - (price * discountPercentage / 100);
};

export const formatPrice = (price: number) => {
  return `$${price.toFixed(2)}`;
};
