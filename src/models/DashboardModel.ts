import type { DashboardResponse } from '@/@types/dashboard';
import { ApiClient } from '@/services/ApiClient';

class DashboardModel {
  private static instance: DashboardModel;
  private apiClient: ApiClient;

  private constructor() {
    this.apiClient = ApiClient.getInstance();
  }

  public static getInstance(): DashboardModel {
    if (!DashboardModel.instance) {
      DashboardModel.instance = new DashboardModel();
    }
    return DashboardModel.instance;
  }

  public async getDashboard(): Promise<DashboardResponse> {
    return this.apiClient.get('/admin/dashboard', true);
  }
}

export default DashboardModel.getInstance();
