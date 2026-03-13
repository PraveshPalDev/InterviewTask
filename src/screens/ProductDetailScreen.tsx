import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions, FlatList, SafeAreaView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { RootStackParamList } from '../types';
import { COLORS, SPACING } from '../theme';
import { calculateDiscountedPrice, formatPrice } from '../utils/price';

type ProductDetailScreenRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;
type ProductDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ProductDetail'>;

interface Props {
  route: ProductDetailScreenRouteProp;
  navigation: ProductDetailScreenNavigationProp;
}

const { width } = Dimensions.get('window');

const ProductDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { product } = route.params;
  const dispatch = useDispatch();

  const discountedPrice = calculateDiscountedPrice(product.price, product.discountPercentage);

  const renderImage = ({ item }: { item: string }) => (
    <Image source={{ uri: item }} style={styles.carouselImage} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageSection}>
          <FlatList
            data={product.images}
            renderItem={renderImage}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.carousel}
          />
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text style={styles.category}>{product.category}</Text>
            <View style={styles.ratingBox}>
              <Text style={styles.ratingText}>★ {product.rating}</Text>
            </View>
          </View>
          
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.brand}>By <Text style={{ color: COLORS.primary }}>{product.brand}</Text></Text>

          <View style={styles.priceSection}>
            <View style={styles.priceRow}>
              <Text style={styles.discountedPrice}>{formatPrice(discountedPrice)}</Text>
              <View style={styles.discountContainer}>
                <Text style={styles.discountBadge}>{product.discountPercentage}% OFF</Text>
              </View>
            </View>
            <Text style={styles.originalPrice}>Original Price: <Text style={styles.strikethrough}>{formatPrice(product.price)}</Text></Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Product Description</Text>
          <Text style={styles.description}>{product.description}</Text>
          
          <View style={styles.specsContainer}>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Availability</Text>
              <Text style={[styles.specValue, { color: product.stock > 0 ? COLORS.secondary : COLORS.danger }]}>
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Stock</Text>
              <Text style={styles.specValue}>{product.stock} units</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.addToCartBtn}
          onPress={() => dispatch(addToCart(product))}
          activeOpacity={0.8}
        >
          <Text style={styles.addToCartText}>Add to Shopping Cart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  imageSection: { position: 'relative' },
  carousel: { height: 400 },
  carouselImage: { width: width, height: 400, resizeMode: 'cover', backgroundColor: '#F8F9FA' },
  backButton: { 
    position: 'absolute', top: 20, left: 20, 
    backgroundColor: 'white', width: 40, height: 40, 
    borderRadius: 20, justifyContent: 'center', alignItems: 'center',
    elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3
  },
  backIcon: { fontSize: 24, color: COLORS.text, fontWeight: 'bold' },
  content: { padding: 25, borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: -30, backgroundColor: 'white' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  category: { color: COLORS.primary, fontWeight: '800', textTransform: 'uppercase', fontSize: 13, letterSpacing: 1 },
  title: { fontSize: 28, fontWeight: 'bold', color: COLORS.text, marginBottom: 6 },
  brand: { fontSize: 16, color: COLORS.textLight, marginBottom: 20 },
  priceSection: { marginBottom: 25 },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  discountedPrice: { fontSize: 34, fontWeight: '900', color: COLORS.secondary, marginRight: 15 },
  discountContainer: { backgroundColor: '#FFEDD5', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  discountBadge: { color: '#C2410C', fontSize: 13, fontWeight: 'bold' },
  originalPrice: { fontSize: 16, color: COLORS.textLight },
  strikethrough: { textDecorationLine: 'line-through' },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.text, marginBottom: 12 },
  description: { fontSize: 16, color: '#4B5563', lineHeight: 26 },
  specsContainer: { flexDirection: 'row', marginTop: 30, backgroundColor: '#F9FAFB', borderRadius: 15, padding: 20 },
  specItem: { flex: 1 },
  specLabel: { fontSize: 14, color: COLORS.textLight, marginBottom: 6 },
  specValue: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
  ratingBox: { backgroundColor: '#FBBF24', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  ratingText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  footer: { padding: 20, paddingBottom: 30, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  addToCartBtn: { backgroundColor: COLORS.primary, padding: 20, borderRadius: 18, alignItems: 'center', elevation: 10, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.3, shadowRadius: 10 },
  addToCartText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});

export default ProductDetailScreen;
