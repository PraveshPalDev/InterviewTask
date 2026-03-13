import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ActivityIndicator, RefreshControl, SafeAreaView } from 'react-native';
import Animated, { FadeInUp, Layout } from 'react-native-reanimated';
import { useDispatch } from 'react-redux';
import { productService } from '../services/productService';
import { addToCart } from '../store/slices/cartSlice';
import { useNetwork } from '../hooks/useNetwork';
import { Product } from '../types';
import { SPACING } from '../theme';
import { calculateDiscountedPrice, formatPrice } from '../utils/price';
import { useAppTheme } from '../hooks/useAppTheme';
import Toast from 'react-native-toast-message';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const HomeScreen = ({ navigation }: any) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const isOffline = useNetwork();
  const dispatch = useDispatch();
  const { colors } = useAppTheme();

  const handleAddToCart = (item: Product) => {
    dispatch(addToCart(item));
    Toast.show({
      type: 'success',
      text1: 'Added to Cart',
      text2: `${item.title} has been added to your bag.`,
      position: 'bottom',
      bottomOffset: 80,
    });
  };

  const fetchProducts = async (newSkip: number, isRefreshing: boolean = false) => {
    try {
      setError(null);
      const data = await productService.getProducts(newSkip);
      
      if (isRefreshing) {
        setProducts(data.products);
      } else {
        setProducts(prev => [...prev, ...data.products]);
      }
      
      setSkip(newSkip + data.products.length);
      setHasMore(newSkip + data.products.length < data.total);
    } catch (err) {
      setError('Failed to fetch products. Check your connection.');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchProducts(0);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProducts(0, true);
  }, []);

  const loadMore = () => {
    if (!loadingMore && hasMore && !loading && !isOffline) {
      setLoadingMore(true);
      fetchProducts(skip);
    }
  };

  const renderItem = ({ item, index }: { item: Product, index: number }) => {
    const discountedPrice = calculateDiscountedPrice(item.price, item.discountPercentage);
    
    return (
      <AnimatedTouchableOpacity 
        entering={FadeInUp.delay(index * 50).duration(400)}
        layout={Layout.springify()}
        style={[styles.card, { backgroundColor: colors.surface }]}
        onPress={() => navigation.navigate('ProductDetail', { product: item })}
        activeOpacity={0.8}
      >
        <Image source={{ uri: item.thumbnail }} style={styles.image} />
        <View style={styles.content}>
          <Text style={[styles.category, { color: colors.primary }]}>{item.category}</Text>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>{item.title}</Text>
          <View style={styles.priceContainer}>
            <Text style={[styles.discountedPrice, { color: colors.secondary }]}>{formatPrice(discountedPrice)}</Text>
            <Text style={[styles.originalPrice, { color: colors.textLight }]}>{formatPrice(item.price)}</Text>
          </View>
          <View style={styles.badgeContainer}>
            <Text style={styles.discountBadge}>{item.discountPercentage.toFixed(0)}% OFF</Text>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>★ {item.rating}</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: colors.primary }]} 
            onPress={() => handleAddToCart(item)}
          >
            <Text style={styles.buttonText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </AnimatedTouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: SPACING.m }} />;
  };

  if (loading && !refreshing) return <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {(isOffline || error) && (
        <View style={[styles.statusBanner, isOffline ? { backgroundColor: colors.accent } : { backgroundColor: colors.danger }]}>
          <Text style={styles.statusText}>
            {isOffline ? 'Offline Mode - Showing Cached Products' : error}
          </Text>
        </View>
      )}
      
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />
        }
        contentContainerStyle={styles.listContainer}
        numColumns={2}
      />
      
      {products.length > 0 && (
        <Animated.View 
          entering={FadeInUp.delay(500).springify()}
          style={[styles.cartFab, { backgroundColor: colors.text }]}
        >
          <TouchableOpacity 
            onPress={() => navigation.navigate('Cart')}
            activeOpacity={0.8}
            style={styles.fabTouchable}
          >
            <Text style={[styles.fabText, { color: colors.surface }]}>View Cart 🛒</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContainer: { padding: SPACING.s },
  loader: { flex: 1, justifyContent: 'center' },
  statusBanner: { padding: SPACING.s, alignItems: 'center' },
  statusText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  card: { 
    flex: 1,
    borderRadius: 15, 
    margin: SPACING.s, 
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  image: { width: '100%', height: 140, backgroundColor: '#f9f9f9', resizeMode: 'cover' },
  content: { padding: SPACING.s + 2 },
  category: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 2 },
  title: { fontSize: 14, fontWeight: 'bold', marginBottom: 4 },
  priceContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  discountedPrice: { fontSize: 16, fontWeight: 'bold', marginRight: 6 },
  originalPrice: { fontSize: 12, textDecorationLine: 'line-through' },
  badgeContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  discountBadge: { backgroundColor: '#E8F5E9', color: '#2E7D32', fontSize: 9, fontWeight: 'bold', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  ratingBadge: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 10, fontWeight: 'bold', color: '#F1C40F' },
  button: { paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  cartFab: { 
    position: 'absolute', bottom: 30, right: 20, 
    borderRadius: 30, 
    elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.3, shadowRadius: 5
  },
  fabTouchable: {
    paddingHorizontal: 25, paddingVertical: 15,
  },
  fabText: { fontWeight: 'bold', fontSize: 16 },
});

export default HomeScreen;
