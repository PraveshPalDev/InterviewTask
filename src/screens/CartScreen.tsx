import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, SafeAreaView, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { removeFromCart, updateQuantity, clearCart } from '../store/slices/cartSlice';
import { COLORS, SPACING } from '../theme';
import { calculateDiscountedPrice, formatPrice } from '../utils/price';

const CartScreen = ({ navigation }: any) => {
  const { items, totalOriginalPrice, totalDiscountedPrice, totalCount } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();

  const renderItem = ({ item }: any) => {
    const itemDiscountedPrice = calculateDiscountedPrice(item.price, item.discountPercentage);

    return (
      <View style={styles.itemCard}>
        <Image source={{ uri: item.thumbnail }} style={styles.thumb} />
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.itemCategory}>{item.category}</Text>
          
          <View style={styles.priceRow}>
            <Text style={styles.itemPrice}>{formatPrice(itemDiscountedPrice)}</Text>
            {item.discountPercentage > 0 && (
              <Text style={styles.itemOriginalPrice}>{formatPrice(item.price)}</Text>
            )}
          </View>
          
          <View style={styles.actionRow}>
            <View style={styles.quantityContainer}>
              <TouchableOpacity 
                onPress={() => dispatch(updateQuantity({ id: item.id, quantity: Math.max(1, item.quantity - 1) }))}
                style={styles.qtyBtn}
              >
                <Text style={styles.qtyBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.qtyText}>{item.quantity}</Text>
              <TouchableOpacity 
                onPress={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                style={styles.qtyBtn}
              >
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              onPress={() => dispatch(removeFromCart(item.id))}
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
    <SafeAreaView style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListHeaderComponent={
          items.length > 0 ? (
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Shopping Bag</Text>
              <Text style={styles.itemCount}>{totalCount} {totalCount === 1 ? 'item' : 'items'}</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <Text style={styles.emptyIcon}>🛍️</Text>
            </View>
            <Text style={styles.emptyTitle}>Your bag is empty</Text>
            <Text style={styles.emptySubtitle}>Looks like you haven't added anything to your bag yet.</Text>
            <TouchableOpacity 
              style={styles.browseBtn}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.browseBtnText}>Start Shopping</Text>
            </TouchableOpacity>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />

      {items.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{formatPrice(totalOriginalPrice)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Bag Discount</Text>
              <Text style={[styles.summaryValue, { color: COLORS.secondary }]}>−{formatPrice(totalSavings)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Order Total</Text>
              <Text style={styles.totalValue}>{formatPrice(totalDiscountedPrice)}</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.checkoutBtn}
            onPress={() => Alert.alert('Checkout Success', 'Your order has been placed successfully!')}
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
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  listContent: { paddingBottom: 30 },
  header: { padding: 25, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  headerTitle: { fontSize: 24, fontWeight: '900', color: COLORS.text },
  itemCount: { fontSize: 14, color: COLORS.textLight, marginTop: 4 },
  itemCard: { 
    flexDirection: 'row', 
    padding: 15, 
    backgroundColor: 'white', 
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
  itemTitle: { fontSize: 17, fontWeight: 'bold', color: COLORS.text },
  itemCategory: { fontSize: 12, color: COLORS.primary, fontWeight: '700', textTransform: 'uppercase', marginBottom: 6 },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  itemPrice: { fontSize: 18, fontWeight: '900', color: COLORS.secondary, marginRight: 8 },
  itemOriginalPrice: { fontSize: 13, color: COLORS.textLight, textDecorationLine: 'line-through' },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 12, padding: 4 },
  qtyBtn: { width: 30, height: 30, backgroundColor: 'white', borderRadius: 10, alignItems: 'center', justifyContent: 'center', elevation: 1 },
  qtyBtnText: { fontSize: 18, color: COLORS.text, fontWeight: 'bold' },
  qtyText: { marginHorizontal: 12, fontSize: 15, fontWeight: 'bold', color: COLORS.text },
  removeBtn: { padding: 5 },
  removeText: { color: COLORS.danger, fontSize: 13, fontWeight: '600' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40, marginTop: 100 },
  emptyIconContainer: { backgroundColor: 'white', width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', elevation: 5, marginBottom: 25 },
  emptyIcon: { fontSize: 50 },
  emptyTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.text, marginBottom: 10 },
  emptySubtitle: { fontSize: 16, color: COLORS.textLight, textAlign: 'center', marginBottom: 35, lineHeight: 22 },
  browseBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 40, paddingVertical: 18, borderRadius: 15, elevation: 5 },
  browseBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  footer: { 
    backgroundColor: 'white', 
    padding: 25, 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
  },
  summaryContainer: { marginBottom: 20 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  summaryLabel: { color: '#6B7280', fontSize: 16 },
  summaryValue: { color: COLORS.text, fontSize: 16, fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 15 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 20, fontWeight: '900', color: COLORS.text },
  totalValue: { fontSize: 24, fontWeight: '900', color: COLORS.primary },
  checkoutBtn: { backgroundColor: COLORS.primary, padding: 20, borderRadius: 20, alignItems: 'center', elevation: 8 },
  checkoutText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});

export default CartScreen;
