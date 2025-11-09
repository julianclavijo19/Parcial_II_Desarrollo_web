/**
 * Servicio para gestionar clientes
 * Por ahora usa datos mock, pero puede conectarse a una API real
 */
class ClientService {
  constructor() {
    // Datos mock de clientes
    this.clients = [
      {
        id: 1,
        name: 'Carlos Rodríguez',
        username: 'crodriguez',
        email: 'carlos@example.com',
        phone: '+57 300 123 4567',
        address: { city: 'Bogotá', street: 'Calle 123', zipcode: '110111' },
        registrationDate: '2024-01-15',
        status: 'active',
        isVip: true
      },
      {
        id: 2,
        name: 'María García',
        username: 'mgarcia',
        email: 'maria@example.com',
        phone: '+57 310 234 5678',
        address: { city: 'Medellín', street: 'Carrera 45', zipcode: '050001' },
        registrationDate: '2024-02-20',
        status: 'active',
        isVip: false
      },
      {
        id: 3,
        name: 'Juan Pérez',
        username: 'jperez',
        email: 'juan@example.com',
        phone: '+57 320 345 6789',
        address: { city: 'Cali', street: 'Avenida 6N', zipcode: '760001' },
        registrationDate: '2024-03-10',
        status: 'active',
        isVip: true
      },
      {
        id: 4,
        name: 'Ana Martínez',
        username: 'amartinez',
        email: 'ana@example.com',
        phone: '+57 315 456 7890',
        address: { city: 'Barranquilla', street: 'Calle 72', zipcode: '080001' },
        registrationDate: '2024-04-05',
        status: 'active',
        isVip: false
      },
      {
        id: 5,
        name: 'Luis Hernández',
        username: 'lhernandez',
        email: 'luis@example.com',
        phone: '+57 305 567 8901',
        address: { city: 'Cartagena', street: 'Calle del Arsenal', zipcode: '130001' },
        registrationDate: '2024-05-12',
        status: 'active',
        isVip: false
      }
    ];
  }

  /**
   * Obtener todos los clientes
   * @returns {Promise} Lista de clientes
   */
  async getAllClients() {
    return Promise.resolve(this.clients);
  }

  /**
   * Obtener un cliente por ID
   * @param {number} id - ID del cliente
   * @returns {Promise} Datos del cliente
   */
  async getClientById(id) {
    const client = this.clients.find(c => c.id === id);
    return Promise.resolve(client || null);
  }

  /**
   * Buscar clientes
   * @param {string} query - Término de búsqueda
   * @returns {Promise} Lista de clientes encontrados
   */
  async searchClients(query) {
    const lowerQuery = query.toLowerCase();
    const filtered = this.clients.filter(client =>
      client.name.toLowerCase().includes(lowerQuery) ||
      client.email.toLowerCase().includes(lowerQuery) ||
      client.phone.includes(query) ||
      client.address.city.toLowerCase().includes(lowerQuery) ||
      client.username.toLowerCase().includes(lowerQuery)
    );
    return Promise.resolve(filtered);
  }

  /**
   * Obtener clientes activos
   * @returns {Promise} Lista de clientes activos
   */
  async getActiveClients() {
    const active = this.clients.filter(c => c.status === 'active');
    return Promise.resolve(active);
  }

  /**
   * Obtener clientes VIP
   * @returns {Promise} Lista de clientes VIP
   */
  async getVipClients() {
    const vip = this.clients.filter(c => c.isVip === true);
    return Promise.resolve(vip);
  }

  /**
   * Obtener estadísticas de clientes
   * @returns {Promise} Estadísticas de clientes
   */
  async getClientStats() {
    const stats = {
      total: this.clients.length,
      active: this.clients.filter(c => c.status === 'active').length,
      vip: this.clients.filter(c => c.isVip === true).length,
      newThisMonth: this.clients.filter(c => {
        const regDate = new Date(c.registrationDate);
        const now = new Date();
        return regDate.getMonth() === now.getMonth() && regDate.getFullYear() === now.getFullYear();
      }).length
    };
    return Promise.resolve(stats);
  }

  /**
   * Crear un nuevo cliente
   * @param {Object} client - Datos del cliente
   * @returns {Promise} Cliente creado
   */
  async createClient(client) {
    const newClient = {
      ...client,
      id: Math.max(...this.clients.map(c => c.id)) + 1,
      registrationDate: new Date().toISOString().split('T')[0],
      status: client.status || 'active',
      isVip: client.isVip || false
    };
    this.clients.push(newClient);
    return Promise.resolve(newClient);
  }

  /**
   * Actualizar un cliente existente
   * @param {number} id - ID del cliente
   * @param {Object} clientData - Datos actualizados del cliente
   * @returns {Promise} Cliente actualizado
   */
  async updateClient(id, clientData) {
    const index = this.clients.findIndex(c => c.id === id);
    if (index !== -1) {
      this.clients[index] = { ...this.clients[index], ...clientData };
      return Promise.resolve(this.clients[index]);
    }
    return Promise.reject(new Error('Cliente no encontrado'));
  }

  /**
   * Eliminar un cliente
   * @param {number} id - ID del cliente
   * @returns {Promise} Cliente eliminado
   */
  async deleteClient(id) {
    const index = this.clients.findIndex(c => c.id === id);
    if (index !== -1) {
      const deleted = this.clients.splice(index, 1)[0];
      return Promise.resolve(deleted);
    }
    return Promise.reject(new Error('Cliente no encontrado'));
  }
}

// Exportar una instancia única del servicio (Singleton)
export default new ClientService();

