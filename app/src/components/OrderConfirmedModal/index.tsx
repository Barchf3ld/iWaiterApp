import { StatusBar } from 'expo-status-bar';
import { Modal } from 'react-native';
import { CheckCircle } from '../Icons/CheckCircle';
import { Text } from '../Text';

import { ContainerConfirmed, OkButton } from './styles';

interface OrderConfirmedModalProps {
	visible: boolean;
	onOk: () => void;
}

export function OrderConfirmedModal({ visible, onOk }: OrderConfirmedModalProps) {
	return (
		<Modal
			visible={visible}
			animationType="fade"
		>

			<StatusBar style='light'/>

			<ContainerConfirmed>
				<CheckCircle/>
				<Text size={20} weight='600' color='#FFF' style={{ marginTop: 12 }}>Pedido Confirmado</Text>
				<Text color='#FFF' opacity={0.9}style={{ marginTop: 4 }}>O pedido já entrou na fila de produção!</Text>
				<OkButton onPress={onOk}>
					<Text color='#04733D' weight='600'>OK</Text>
				</OkButton>
			</ContainerConfirmed>
		</Modal>
	);
}