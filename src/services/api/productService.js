import apiClient from '../../config/api';
import { GAMING_CATEGORIES, CATEGORY_NAMES } from '../../config/constants';

/**
 * Servicio para gestionar operaciones CRUD de productos
 */
class ProductService {
  /**
   * Obtener todos los productos
   * @param {number} limit - Límite de productos a retornar
   * @returns {Promise} Lista de productos
   */
  async getAllProducts(limit = 100) {
    try {
      const response = await apiClient.get(`/products?limit=${limit}`);
      return response.data.products;
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
      const response = await apiClient.get(`/products/${id}`);
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
      const response = await apiClient.get(`/products/category/${category}`);
      return response.data.products;
    } catch (error) {
      console.error(`Error al obtener productos de categoría ${category}:`, error);
      throw error;
    }
  }

  /**
   * Limitar el número de productos retornados
   * @param {number} limit - Número máximo de productos
   * @returns {Promise} Lista limitada de productos
   */
  async getLimitedProducts(limit = 10) {
    return this.getAllProducts(limit);
  }

  /**
   * Buscar productos
   * @param {string} query - Término de búsqueda
   * @returns {Promise} Lista de productos encontrados
   */
  async searchProducts(query) {
    try {
      const response = await apiClient.get(`/products/search?q=${query}`);
      return response.data.products;
    } catch (error) {
      console.error('Error al buscar productos:', error);
      throw error;
    }
  }

  /**
   * Crear un nuevo producto
   * NOTA: DummyJSON API simula la creación pero no persiste los datos
   * @param {Object} product - Datos del producto
   * @returns {Promise} Producto creado
   */
  async createProduct(product) {
    try {
      const response = await apiClient.post('/products/add', product);
      return response.data;
    } catch (error) {
      console.error('Error al crear producto:', error);
      throw error;
    }
  }

  /**
   * Actualizar un producto existente
   * NOTA: DummyJSON API simula la actualización pero no persiste los datos
   * @param {number} id - ID del producto
   * @param {Object} product - Datos actualizados del producto
   * @returns {Promise} Producto actualizado
   */
  async updateProduct(id, product) {
    try {
      const response = await apiClient.put(`/products/${id}`, product);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar producto ${id}:`, error);
      throw error;
    }
  }

  /**
   * Eliminar un producto
   * NOTA: DummyJSON API simula la eliminación pero no persiste los cambios
   * @param {number} id - ID del producto
   * @returns {Promise} Producto eliminado
   */
  async deleteProduct(id) {
    try {
      const response = await apiClient.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar producto ${id}:`, error);
      throw error;
    }
  }
}

// Exportar una instancia única del servicio (Singleton)
export default new ProductService();

