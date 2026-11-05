import api from './api';

export const pesananService = {
  // Pelanggan: kirim pesanan baru (multipart/form-data)
  async createPesanan(formData) {
    return await api.post('/pemesanan', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Pelanggan: ambil riwayat pesanan sendiri
  async getRiwayat(params = {}) {
    return await api.get('/pemesanan', { params });
  },

  // Pelanggan: detail pesanan sendiri
  async getDetail(id) {
    return await api.get(`/pemesanan/${id}`);
  },

  // Admin: daftar seluruh pesanan masuk dengan filter & pencarian
  async getAdminPesanan(params = {}) {
    return await api.get('/admin/pesanan', { params });
  },

  // Admin: update status pesanan
  async updateStatus(id, { status_pemesanan, alasan_batal }) {
    return await api.patch(`/admin/pesanan/${id}/status`, {
      status_pemesanan,
      alasan_batal,
    });
  },

  // Admin: hapus pesanan
  async deletePesanan(id) {
    return await api.delete(`/admin/pesanan/${id}`);
  },

  // Admin: URL download mockup
  getDownloadMockupUrl(id) {
    const baseURL = api.defaults.baseURL;
    return `${baseURL}/admin/pesanan/${id}/download-desain`;
  },

  // Admin: dashboard metrics
  async getDashboardStats() {
    return await api.get('/admin/dashboard');
  },

  // Admin: daftar pelanggan
  async getPelanggan(params = {}) {
    return await api.get('/admin/pelanggan', { params });
  },

  // Admin: detail pelanggan
  async getPelangganDetail(id) {
    return await api.get(`/admin/pelanggan/${id}`);
  },

  // Admin: tambah pelanggan manual
  async createPelanggan(data) {
    return await api.post('/admin/pelanggan', data);
  },

  // Admin: update data pelanggan
  async updatePelanggan(id, data) {
    return await api.put(`/admin/pelanggan/${id}`, data);
  },

  // Admin: hapus pelanggan
  async deletePelanggan(id) {
    return await api.delete(`/admin/pelanggan/${id}`);
  },
};

