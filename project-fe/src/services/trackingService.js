import api from './api';

export const trackingService = {
  // Lacak pesanan publik berdasarkan nomor resi
  async trackResi(kodeResi) {
    const clean = encodeURIComponent(kodeResi.trim().toUpperCase());
    return await api.get(`/tracking/${clean}`);
  },
};

export const catalogService = {
  // Ambil daftar layanan
  async getLayanan(params = {}) {
    return await api.get('/layanan', { params });
  },

  // Ambil detail satu layanan
  async getLayananDetail(id) {
    return await api.get(`/layanan/${id}`);
  },

  // Ambil daftar portofolio
  async getPortofolio(params = {}) {
    return await api.get('/portofolio', { params });
  },

  // Ambil detail satu portofolio
  async getPortofolioDetail(id) {
    return await api.get(`/portofolio/${id}`);
  },

  // Admin: tambah portofolio
  async createPortofolio(formData) {
    return await api.post('/admin/portofolio', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // Admin: update portofolio
  async updatePortofolio(id, formData) {
    return await api.post(`/admin/portofolio/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // Admin: hapus portofolio
  async deletePortofolio(id) {
    return await api.delete(`/admin/portofolio/${id}`);
  },

  // Admin: tambah layanan
  async createLayanan(formData) {
    return await api.post('/admin/layanan', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // Admin: update layanan
  async updateLayanan(id, formData) {
    return await api.post(`/admin/layanan/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // Admin: hapus layanan
  async deleteLayanan(id) {
    return await api.delete(`/admin/layanan/${id}`);
  },
};

