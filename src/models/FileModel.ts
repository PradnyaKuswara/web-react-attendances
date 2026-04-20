import type { FileResponse } from '@/@types/file';
import { ApiClient } from '@/services/ApiClient';

class FileModel {
  private static instance: FileModel;
  private apiClient: ApiClient;

  private constructor() {
    this.apiClient = ApiClient.getInstance();
  }

  public static getInstance(): FileModel {
    if (!FileModel.instance) {
      FileModel.instance = new FileModel();
    }
    return FileModel.instance;
  }

  public async uploadFile(file: File): Promise<FileResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.apiClient.post('/files/upload', formData, true);
  }
}

export default FileModel.getInstance();
