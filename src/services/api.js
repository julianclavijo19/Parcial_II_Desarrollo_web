import axios from 'axios';

// URL base de la API externa (FakeStore API)
const API_BASE_URL = 'https://fakestoreapi.com';

/**
 * Servicio para gestionar operaciones CRUD de productos
 * usando la API externa FakeStore API
 */
class ProductService {
  /**
   * Obtener todos los productos
   * @returns {Promise} Lista de productos
   */
  async getAllProducts() {
    try {
      const response = await axios.get(`${API_BASE_URL}/products`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener productos:', error);
      throw error;
    }
  }

  /**
   * Obtener un producto por ID
   * @param {number} id - ID del producto
   * @returns {Promise} Datos del producto
   */
  async getProductById(id) {
    try {
      const response = await axios.get(`${API_BASE_URL}/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener producto ${id}:`, error);
      throw error;
    }
  }

  /**
   * Obtener productos por categoría
   * @param {string} category - Nombre de la categoría
   * @returns {Promise} Lista de productos filtrados
   */
  async getProductsByCategory(category) {
    try {
      const response = await axios.get(`${API_BASE_URL}/products/category/${category}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener productos de categoría ${category}:`, error);
      throw error;
    }
  }

  /**
   * Obtener todas las categorías disponibles
   * @returns {Promise} Lista de categorías
   */
  async getCategories() {
    try {
      const response = await axios.get(`${API_BASE_URL}/products/categories`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      throw error;
    }
  }

  /**
   * Crear un nuevo producto
   * NOTA: FakeStore API simula la creación pero no persiste los datos
   * @param {Object} product - Datos del producto
   * @returns {Promise} Producto creado
   */
  async createProduct(product) {
    try {
      const response = await axios.post(`${API_BASE_URL}/products`, product);
      return response.data;
    } catch (error) {
      console.error('Error al crear producto:', error);
      throw error;
    }
  }

  /**
   * Actualizar un producto existente
   * NOTA: FakeStore API simula la actualización pero no persiste los datos
   * @param {number} id - ID del producto
   * @param {Object} product - Datos actualizados del producto
   * @returns {Promise} Producto actualizado
   */
  async updateProduct(id, product) {
    try {
      const response = await axios.put(`${API_BASE_URL}/products/${id}`, product);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar producto ${id}:`, error);
      throw error;
    }
  }

  /**
   * Eliminar un producto
   * NOTA: FakeStore API simula la eliminación pero no persiste los cambios
   * @param {number} id - ID del producto
   * @returns {Promise} Producto eliminado
   */
  async deleteProduct(id) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar producto ${id}:`, error);
      throw error;
    }
  }

  /**
   * Limitar el número de productos retornados
   * @param {number} limit - Número máximo de productos
   * @returns {Promise} Lista limitada de productos
   */
  async getLimitedProducts(limit = 10) {
    try {
      const response = await axios.get(`${API_BASE_URL}/products?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener productos limitados:', error);
      throw error;
    }
  }
}

// Exportar una instancia única del servicio (Singleton)
export default new ProductService();

