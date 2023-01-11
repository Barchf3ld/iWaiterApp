import React, { useState } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';

import { CartItem } from '../../types/CartItems';
import { Product } from '../../types/Product';
import { api } from '../../utils/api';
import { formatCurrency } from '../../utils/formatCurrency';
import { Button } from '../Button';
import { MinusCircleCart } from '../Icons/MinusCircleCart';
import { PlusCircleCart } from '../Icons/PlusCircleCart';
import { OrderConfirmedModal } from '../OrderConfirmedModal';
import { Text } from '../Text';

import { Item, ProductContainer, Actions, ImageCart, QuantityContainer, ProductDetailsCart, Sumary, TotalCart } from './styled';

interface CartProps {
	cartItems: CartItem[];
	onAdd: (product: Product) => void;
	onDecrement: (product: Product) => void;
	onConfirmOrder: () => void;
	selectedTable: string;
}

export function Cart({ cartItems, onAdd, onDecrement, onConfirmOrder, selectedTable }: CartProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [isModalOrderVisible, setIsModalOrderVisible] = useState(false);

	const total = cartItems.reduce((acc, cartItem) => {
		return acc + cartItem.quantity * cartItem.product.price;
	}, 0);

	async function handleConfirmOrder() {
		setIsLoading(true);

		const payload = {
			table: selectedTable,
			products: cartItems.map((cartItems) => ({
				product: cartItems.product._id,
				quantity: cartItems.quantity,
			})),
		};

		await api.post('/orders', payload);

		setIsLoading(false);
		setIsModalOrderVisible(true);
	}

	function handleOk() {
		onConfirmOrder();
		setIsModalOrderVisible(false);
	}

	return (
		<>
			<OrderConfirmedModal
				visible={isModalOrderVisible}
				onOk={handleOk}
			/>

			{cartItems.length > 0 && (
				<FlatList
					data={cartItems}
					keyExtractor={cartItems => cartItems.product._id}
					showsVerticalScrollIndicator={false}
					style={{ marginBottom: 20, maxHeight: 160 }}
					renderItem={({ item: cartItems }) => (
						<Item>
							<ProductContainer>
								<ImageCart
									source={{
										uri: `http://192.168.68.117:3001/uploads/${cartItems.product.imagePath}`
									}}
								/>

								<QuantityContainer>
									<Text size={14} color="#666">
										{cartItems.quantity}x
									</Text>
								</QuantityContainer>

								<ProductDetailsCart>
									<Text size={14} weight="600">{cartItems.product.name}</Text>
									<Text size={14} color="#666" style={{ marginTop: 12 }}>{formatCurrency(cartItems.product.price)}</Text>
								</ProductDetailsCart>
							</ProductContainer>

							<Actions>
								<TouchableOpacity
									style={{ marginRight: 28 }}
									onPress={() => onAdd(cartItems.product)}
								>
									<PlusCircleCart />
								</TouchableOpacity>

								<TouchableOpacity onPress={() => onDecrement(cartItems.product)}>
									<MinusCircleCart />
								</TouchableOpacity>
							</Actions>
						</Item>
					)}
				/>
			)}

			<Sumary>
				<TotalCart>
					{cartItems.length > 0 ? (
						<>
							<Text color='#666'>Total</Text>
							<Text size={20} weight="600">{formatCurrency(total)}</Text>
						</>
					) : (
						<Text color='#999'>Seu carrinho está vazio</Text>
					)}
				</TotalCart>

				<Button
					onPress={handleConfirmOrder}
					disabled={cartItems.length === 0}
					loading={isLoading}>
						Confirmar Pedido
				</Button>
			</Sumary>
		</>
	);
}