import { TouchableOpacity } from 'react-native';
import { Text } from '../Text';
import { Container, ContentHeader, OrderHeader, Table } from './style';

interface HeaderProps {
	selectTable: string;
	onCancelOrder: () => void;
}

export function Header({ selectTable, onCancelOrder }: HeaderProps) {
	return (
		<Container>
			{!selectTable && (
				<><Text size={16} opacity={0.9}>Bem vindo(a) ao</Text>
					<Text size={26} weight="700">iWAITER
						<Text size={26}>APP</Text></Text></>
			)}

			{selectTable && (
				<ContentHeader>
					<OrderHeader>
						<Text size={24} weight="600">Pedido</Text>
						<TouchableOpacity onPress={onCancelOrder}>
							<Text color="#D73035" weight='600' size={14}>Cancelar pedido</Text>
						</TouchableOpacity>
					</OrderHeader>

					<Table>
						<Text color='#666'>Mesa {selectTable}</Text>
					</Table>
				</ContentHeader>
			)}
		</Container>
	);
}