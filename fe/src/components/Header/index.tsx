import logogreen from '../../assets/images/logogreen.svg';

import { Container, Content } from './styles';

export function Header() {
  return (
    <Container>
      <Content>
        <div className="page-details">
          <h1>Pedidos</h1>
          <h2>Acompanhe os pedidos dos clientes</h2>
        </div>

        <img src={logogreen} alt="WAITERAPP" />
      </Content>
    </Container>
  );
}
