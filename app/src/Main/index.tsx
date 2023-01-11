import { ActivityIndicator } from 'react-native';

import { Container, CategoriesContainer, MenuContainer, Footer, CenteredContainer } from './styles';

import { Header } from '../components/Header';
import { Categories } from '../components/Categories';
import { Menu } from '../components/Menu';
import { Button } from '../components/Button';
import { TableModal } from '../components/TableModal';
import { useEffect, useState } from 'react';
import { Cart } from '../components/Cart';
import { CartItem } from '../types/CartItems';
import { Product } from '../types/Product';

import { Empty } from '../components/Icons/Empty';
import { Text } from '../components/Text';
import { Category } from '../types/Category';

import { api } from '../utils/api';

export function Main() {
	const [isTableModalVisible, setIsTableModalVisible] = useState(false);
	const [selectTable, setSelectTable] = useState('');
	const [cartItems, setCartItems] = useState<CartItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [products, setProducts] = useState<Product[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [isLoadingProducts, setIsLoadingProducts] = useState(false);

	useEffect(() => {
		Promise.all([
			api.get('/categories'),
			api.get('/products'),
		]).then(([categoriesResponse, productsResponse]) => {
			setCategories(categoriesResponse.data);
			setProducts(productsResponse.data);
			setIsLoading(false);
		});
	}, []);

	async function handleSelectCategory(categoryId: string) {
		const route = !categoryId ? '/products': `/categories/${categoryId}/products`;

		setIsLoadingProducts(true);

		const { data } = await api.get(route);
		setProducts(data);
		setIsLoadingProducts(false);
	}

	function handleSaveTable(table: string) {
		setSelectTable(table);
		setIsTableModalVisible(false);
	}

	function handleResetOrder() {
		setSelectTable('');
		setCartItems([]);
	}

	function handleAddToCart(product: Product) {
		if (!selectTable) {
			setIsTableModalVisible(true);
		}

		setCartItems((prevState) => {
			const itemIndex = prevState.findIndex(cartItems => cartItems.product._id === product._id);

			if (itemIndex < 0) {
				return prevState.concat({
					quantity: 1,
					product,
				});
			}

			const newCartItems = [...prevState];
			const item = newCartItems[itemIndex];

			newCartItems[itemIndex] = {
				...item,
				quantity: item.quantity + 1,
			};

			return newCartItems;
		});
	}

	function handleDecrementCartItem(product: Product) {
		setCartItems((prevState) => {
			const itemIndex = prevState.findIndex(cartItems => cartItems.product._id === product._id);

			const item = prevState[itemIndex];
			const newCartItems = [...prevState];

			if (item.quantity === 1) {
				newCartItems.splice(itemIndex, 1);

				return newCartItems;
			}

			newCartItems[itemIndex] = {
				...item,
				quantity: item.quantity - 1,
			};

			return newCartItems;
		});
	}

	return (
		<>
			<Container>
				<Header
					selectTable={selectTable}
					onCancelOrder={handleResetOrder} />

				{isLoading ? (
					<CenteredContainer>
						<ActivityIndicator color="#04733D" size="large"/>
					</CenteredContainer>
				) : (
					<>
						<CategoriesContainer>
							<Categories
								categories={categories}
								onSelectCategory={handleSelectCategory}
							/>
						</CategoriesContainer>

						{isLoadingProducts ? (
							<CenteredContainer>
								<ActivityIndicator color="#04733D" size="large"/>
							</CenteredContainer>
						) : (
							<>
								{products.length > 0 ? (
									<MenuContainer>
										<Menu
											onAddToCart={handleAddToCart}
											products={products}
										/>
									</MenuContainer>
								) : (
									<CenteredContainer>
										<Empty />
										<Text color='#666' style={{ marginTop: 24 }}>Nenhum produto foi encontrado!</Text>
									</CenteredContainer>
								)}
							</>
						)}
					</>
				)}


			</Container>
			<Footer>
				{/* <FooterContainer> */}
				{!selectTable && (
					<Button
						onPress={() => setIsTableModalVisible(true)}
						disabled={isLoading}
					>
						Novo Pedido
					</Button>
				)}

				{selectTable && (
					<Cart
						cartItems = {cartItems}
						onAdd = {handleAddToCart}
						onDecrement = {handleDecrementCartItem}
						onConfirmOrder = {handleResetOrder}
						selectedTable = {selectTable}
					/>
				)}
				{/* </FooterContainer> */}
			</Footer>
			<TableModal
				visible={isTableModalVisible}
				onClose={() => setIsTableModalVisible(false)}
				onSave={handleSaveTable}
			/>
		</>
	);
}