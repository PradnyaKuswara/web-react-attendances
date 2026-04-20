import type { Response } from '@/@types/response';

export const handleResponse = async (response: Response) => {
  const data = await response.json();
  const errorMessage = data.message || 'Terjadi kesalahan yang tidak terduga.';
  const isDevelopment = import.meta.env.PUBLIC_NODE_ENV !== 'development';

  switch (data.statusCode) {
    case 200:
    case 201:
      return data;
    case 400:
      throw new Error(errorMessage);
    case 401:
      throw new Error(
        !isDevelopment
          ? 'Kredensial tidak valid. Silakan coba lagi.'
          : 'Error: ' + errorMessage,
      );
    case 403:
      throw new Error(
        !isDevelopment
          ? 'Akses ditolak. Anda tidak memiliki izin untuk melakukan tindakan ini.'
          : 'Error: ' + errorMessage,
      );
    case 404:
      throw new Error(
        !isDevelopment
          ? 'Sumber daya tidak ditemukan. Silakan periksa URL atau ID yang Anda berikan.'
          : 'Error: ' + errorMessage,
      );
    case 422:
      throw new Error(
        !isDevelopment
          ? 'Data yang Anda kirim tidak valid. Silakan periksa kembali input Anda.'
          : 'Error: ' + errorMessage,
      );
    case 500:
      throw new Error(
        !isDevelopment
          ? 'Terjadi kesalahan pada server. Silakan coba lagi nanti.'
          : 'Error: ' + errorMessage,
      );
    default:
      throw new Error(
        !isDevelopment
          ? 'Terjadi kesalahan yang tidak terduga. Silakan coba lagi.'
          : `Error: ${errorMessage} (Status Code: ${response.status})`,
      );
  }
};
