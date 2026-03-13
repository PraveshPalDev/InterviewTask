import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions, FlatList, SafeAreaView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { RootStackParamList } from '../types';
import { SPACING } from '../theme';
import { calculateDiscountedPrice, formatPrice } from '../utils/price';
import { useAppTheme } from '../hooks/useAppTheme';
import Toast from 'react-native-toast-message';

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
  const { colors } = useAppTheme();

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    Toast.show({
      type: 'success',
      text1: 'Added to Cart',
      text2: `${product.title} has been added to your bag.`,
      position: 'bottom',
      bottomOffset: 100,
    });
  };

  const discountedPrice = calculateDiscountedPrice(product.price, product.discountPercentage);

  const renderImage = ({ item }: { item: string }) => (
    <Image source={{ uri: item }} style={styles.carouselImage} />
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
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
        </View>

        <View style={[styles.content, { backgroundColor: colors.surface }]}>
          <View style={styles.headerRow}>
            <Text style={[styles.category, { color: colors.primary }]}>{product.category}</Text>
            <View style={styles.ratingBox}>
              <Text style={styles.ratingText}>★ {product.rating}</Text>
            </View>
          </View>
          
          <Text style={[styles.title, { color: colors.text }]}>{product.title}</Text>
          <Text style={[styles.brand, { color: colors.textLight }]}>By <Text style={{ color: colors.primary }}>{product.brand}</Text></Text>

          <View style={styles.priceSection}>
            <View style={styles.priceRow}>
              <Text style={[styles.discountedPrice, { color: colors.secondary }]}>{formatPrice(discountedPrice)}</Text>
              <View style={styles.discountContainer}>
                <Text style={styles.discountBadge}>{product.discountPercentage}% OFF</Text>
              </View>
            </View>
            <Text style={[styles.originalPrice, { color: colors.textLight }]}>Original Price: <Text style={styles.strikethrough}>{formatPrice(product.price)}</Text></Text>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Product Description</Text>
          <Text style={[styles.description, { color: colors.textLight, opacity: 0.9 }]}>{product.description}</Text>
          
          <View style={[styles.specsContainer, { backgroundColor: colors.background }]}>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Availability</Text>
              <Text style={[styles.specValue, { color: product.stock > 0 ? colors.secondary : colors.danger }]}>
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Stock</Text>
              <Text style={[styles.specValue, { color: colors.text }]}>{product.stock} units</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <TouchableOpacity 
          style={[styles.addToCartBtn, { backgroundColor: colors.primary }]}
          onPress={handleAddToCart}
          activeOpacity={0.8}
        >
          <Text style={styles.addToCartText}>Add to Shopping Cart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  imageSection: { position: 'relative' },
  carousel: { height: 400 },
  carouselImage: { width: width, height: 400, resizeMode: 'cover', backgroundColor: '#F8F9FA' },
  content: { padding: 25, borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: -30 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  category: { fontWeight: '800', textTransform: 'uppercase', fontSize: 13, letterSpacing: 1 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 6 },
  brand: { fontSize: 16, marginBottom: 20 },
  priceSection: { marginBottom: 25 },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  discountedPrice: { fontSize: 34, fontWeight: '900', marginRight: 15 },
  discountContainer: { backgroundColor: '#FFEDD5', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  discountBadge: { color: '#C2410C', fontSize: 13, fontWeight: 'bold' },
  originalPrice: { fontSize: 16 },
  strikethrough: { textDecorationLine: 'line-through' },
  divider: { height: 1, marginVertical: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  description: { fontSize: 16, lineHeight: 26 },
  specsContainer: { flexDirection: 'row', marginTop: 30, borderRadius: 15, padding: 20 },
  specItem: { flex: 1 },
  specLabel: { fontSize: 14, color: '#9ca3af', marginBottom: 6 },
  specValue: { fontSize: 16, fontWeight: 'bold' },
  ratingBox: { backgroundColor: '#FBBF24', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  ratingText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  footer: { padding: 20, paddingBottom: 30, borderTopWidth: 1 },
  addToCartBtn: { padding: 20, borderRadius: 18, alignItems: 'center', elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.3, shadowRadius: 10 },
  addToCartText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});

export default ProductDetailScreen;
