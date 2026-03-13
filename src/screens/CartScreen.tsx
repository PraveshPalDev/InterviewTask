import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, SafeAreaView, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { removeFromCart, updateQuantity } from '../store/slices/cartSlice';
import { SPACING } from '../theme';
import { calculateDiscountedPrice, formatPrice } from '../utils/price';
import { useAppTheme } from '../hooks/useAppTheme';
import Toast from 'react-native-toast-message';

const CartScreen = ({ navigation }: any) => {
  const { items, totalOriginalPrice, totalDiscountedPrice, totalCount } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const { colors } = useAppTheme();

  const handleRemoveFromCart = (item: any) => {
    dispatch(removeFromCart(item.id));
    Toast.show({
      type: 'info',
      text1: 'Item Removed',
      text2: `${item.title} has been removed from your bag.`,
      position: 'bottom',
    });
  };

  const handleCheckout = () => {
    Toast.show({
      type: 'success',
      text1: 'Checkout Successful',
      text2: 'Thank you for your purchase!',
      position: 'bottom',
    });
    // Optional: dispatch clearCart() here if desired
  };

  const renderItem = ({ item }: any) => {
    const itemDiscountedPrice = calculateDiscountedPrice(item.price, item.discountPercentage);

    return (
      <View style={[styles.itemCard, { backgroundColor: colors.surface }]}>
        <Image source={{ uri: item.thumbnail }} style={styles.thumb} />
        <View style={styles.itemInfo}>
          <Text style={[styles.itemTitle, { color: colors.text }]} numberOfLines={1}>{item.title}</Text>
          <Text style={[styles.itemCategory, { color: colors.primary }]}>{item.category}</Text>
          
          <View style={styles.priceRow}>
            <Text style={[styles.itemPrice, { color: colors.secondary }]}>{formatPrice(itemDiscountedPrice)}</Text>
            {item.discountPercentage > 0 && (
              <Text style={[styles.itemOriginalPrice, { color: colors.textLight }]}>{formatPrice(item.price)}</Text>
            )}
          </View>
          
          <View style={styles.actionRow}>
            <View style={[styles.quantityContainer, { backgroundColor: colors.background }]}>
              <TouchableOpacity 
                onPress={() => dispatch(updateQuantity({ id: item.id, quantity: Math.max(1, item.quantity - 1) }))}
                style={[styles.qtyBtn, { backgroundColor: colors.surface }]}
              >
                <Text style={[styles.qtyBtnText, { color: colors.text }]}>−</Text>
              </TouchableOpacity>
              <Text style={[styles.qtyText, { color: colors.text }]}>{item.quantity}</Text>
              <TouchableOpacity 
                onPress={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                style={[styles.qtyBtn, { backgroundColor: colors.surface }]}
              >
                <Text style={[styles.qtyBtnText, { color: colors.text }]}>+</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              onPress={() => handleRemoveFromCart(item)}
              style={styles.removeBtn}
            >
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const totalSavings = totalOriginalPrice - totalDiscountedPrice;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListHeaderComponent={
          items.length > 0 ? (
            <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
              <Text style={[styles.headerTitle, { color: colors.text }]}>Shopping Bag</Text>
              <Text style={[styles.itemCount, { color: colors.textLight }]}>{totalCount} {totalCount === 1 ? 'item' : 'items'}</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyIconContainer, { backgroundColor: colors.surface }]}>
              <Text style={styles.emptyIcon}>🛍️</Text>
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>Your bag is empty</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textLight }]}>Looks like you haven't added anything to your bag yet.</Text>
            <TouchableOpacity 
              style={[styles.browseBtn, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.browseBtnText}>Start Shopping</Text>
            </TouchableOpacity>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />

      {items.length > 0 && (
        <View style={[styles.footer, { backgroundColor: colors.surface, shadowColor: colors.text }]}>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textLight }]}>Subtotal</Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>{formatPrice(totalOriginalPrice)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textLight }]}>Bag Discount</Text>
              <Text style={[styles.summaryValue, { color: colors.secondary }]}>−{formatPrice(totalSavings)}</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { color: colors.text }]}>Order Total</Text>
              <Text style={[styles.totalValue, { color: colors.primary }]}>{formatPrice(totalDiscountedPrice)}</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={[styles.checkoutBtn, { backgroundColor: colors.primary }]}
            onPress={handleCheckout}
            activeOpacity={0.8}
          >
            <Text style={styles.checkoutText}>Proceed to Checkout</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { paddingBottom: 30 },
  header: { padding: 25, borderBottomWidth: 1 },
  headerTitle: { fontSize: 24, fontWeight: '900' },
  itemCount: { fontSize: 14, marginTop: 4 },
  itemCard: { 
    flexDirection: 'row', 
    padding: 15, 
    marginHorizontal: SPACING.m, 
    marginTop: SPACING.m, 
    borderRadius: 18,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  thumb: { width: 100, height: 100, resizeMode: 'cover', backgroundColor: '#F3F4F6', borderRadius: 12 },
  itemInfo: { flex: 1, marginLeft: 15, justifyContent: 'space-between' },
  itemTitle: { fontSize: 17, fontWeight: 'bold' },
  itemCategory: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', marginBottom: 6 },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  itemPrice: { fontSize: 18, fontWeight: '900', marginRight: 8 },
  itemOriginalPrice: { fontSize: 13, textDecorationLine: 'line-through' },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, padding: 4 },
  qtyBtn: { width: 30, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center', elevation: 1 },
  qtyBtnText: { fontSize: 18, fontWeight: 'bold' },
  qtyText: { marginHorizontal: 12, fontSize: 15, fontWeight: 'bold' },
  removeBtn: { padding: 5 },
  removeText: { color: '#e74c3c', fontSize: 13, fontWeight: '600' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40, marginTop: 100 },
  emptyIconContainer: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', elevation: 5, marginBottom: 25 },
  emptyIcon: { fontSize: 50 },
  emptyTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  emptySubtitle: { fontSize: 16, textAlign: 'center', marginBottom: 35, lineHeight: 22 },
  browseBtn: { paddingHorizontal: 40, paddingVertical: 18, borderRadius: 15, elevation: 5 },
  browseBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  footer: { 
    padding: 25, 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30,
    elevation: 20,
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
  },
  summaryContainer: { marginBottom: 20 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  summaryLabel: { fontSize: 16 },
  summaryValue: { fontSize: 16, fontWeight: 'bold' },
  divider: { height: 1, marginVertical: 15 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 20, fontWeight: '900' },
  totalValue: { fontSize: 24, fontWeight: '900' },
  checkoutBtn: { padding: 20, borderRadius: 20, alignItems: 'center', elevation: 8 },
  checkoutText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});

export default CartScreen;
