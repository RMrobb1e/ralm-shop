import { Badge, Container, Nav, NavDropdown, Navbar } from 'react-bootstrap';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import logo from '../assets/logo.svg';
import { RootState } from '../types/store';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import SearchBox from './SearchBox';

const Header = () => {
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApi] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApi().unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (err: any) {
      toast.error(err?.data.message ?? err.error);
    }
  };

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="md" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>
              <img
                src={logo}
                alt="logo"
                style={{ width: 30, marginRight: 12, color: 'white' }}
              />
              RalmShop
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="justify-content-end"
          >
            <Nav className="ms-auto">
              <SearchBox />
              <LinkContainer to="/cart">
                <Nav.Link>
                  <FaShoppingCart /> Cart
                  {cartItems.length > 0 && (
                    <Badge pill bg="success" style={{ marginLeft: '5px' }}>
                      {cartItems.reduce((a, c) => a + c.qty, 0)}
                    </Badge>
                  )}
                </Nav.Link>
              </LinkContainer>
              {userInfo ? (
                <>
                  <NavDropdown title={userInfo.name} id="username">
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>Profile</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item onClick={logoutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link>
                    <FaUser />
                    Sign In
                  </Nav.Link>
                </LinkContainer>
              )}
              {userInfo?.isAdmin && (
                <NavDropdown title="Admin" id="admin-menu">
                  <LinkContainer to="/admin/user-list">
                    <NavDropdown.Item>Users</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/product-list">
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/order-list">
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
