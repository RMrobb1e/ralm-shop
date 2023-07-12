import { LinkContainer } from 'react-router-bootstrap';
import {
  useCreateProductMutation,
  useGetProductsQuery,
} from '../../slices/productsApiSlice';
import Loader from '../../components/Loader';
import { Button, Col, Row, Table } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Message from '../../components/Message';
import { toast } from 'react-toastify';

const ProductListScreen = () => {
  const { data: products, isLoading, error, refetch } = useGetProductsQuery();
  const [createProduct, { isLoading: isLoadingCreate }] =
    useCreateProductMutation();

  const deleteHandler = (id: string) => {
    if (window.confirm('Are you sure?')) {
      // delete products
    }
  };

  const createProductHandler = async () => {
    if (window.confirm('Are you sure you want to create a new product?')) {
      try {
        await createProduct();
        refetch();
        toast.success('Product created successfully');
      } catch (error: any) {
        toast.error(error?.data.message ?? error.error);
      }
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <Message variant="danger">{error}</Message>;
  }

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-end">
          <Button className="btn-sm m-3" onClick={createProductHandler}>
            <FaEdit /> {isLoadingCreate ? 'Creating ...' : 'Create Product'}
          </Button>
        </Col>
      </Row>
      <Table striped bordered hover responsive className="table-sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>PRICE</th>
            <th>CATEGORY</th>
            <th>BRAND</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {products?.map((product) => (
            <tr key={product._id}>
              <td>{product._id}</td>
              <td>{product.name}</td>
              <td>${product.price}</td>
              <td>{product.category}</td>
              <td>{product.brand}</td>
              <td>
                <LinkContainer to={`/admin/product/${product._id}/edit`}>
                  <Button className="btn-sm mx-2">
                    <FaEdit />
                  </Button>
                </LinkContainer>
                <Button
                  variant="danger"
                  className="btn-sm"
                  onClick={() => deleteHandler(product._id)}
                >
                  <FaTrash style={{ color: 'white' }} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default ProductListScreen;