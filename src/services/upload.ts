import api from '../plugins/axios';
import axios, { type AxiosProgressEvent, type AxiosRequestConfig, CancelTokenSource } from 'axios';

export interface UploadOptions {
  endpoint?: string;
  fieldName?: string;
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  onProgress?: (progress: number) => void;
  config?: AxiosRequestConfig;
}

export interface UploadResult {
  success: boolean;
  data?: any;
  error?: string;
}

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export const validateFile = (
  file: File,
  options: { maxSize?: number; allowedTypes?: string[] } = {}
): FileValidationResult => {
  const { maxSize, allowedTypes } = options;

  if (maxSize && file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
    return {
      valid: false,
      error: `File size exceeds maximum allowed size of ${maxSizeMB}MB`,
    };
  }

  if (allowedTypes && allowedTypes.length > 0) {
    const fileType = file.type || '';
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
    const isAllowed =
      allowedTypes.some((type) => fileType.includes(type)) ||
      allowedTypes.some((type) => type.includes(fileExtension));

    if (!isAllowed) {
      return {
        valid: false,
        error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`,
      };
    }
  }

  return { valid: true };
};

export const uploadFile = async (
  file: File,
  options: UploadOptions = {}
): Promise<UploadResult> => {
  const {
    endpoint = '/upload',
    fieldName = 'file',
    maxSize,
    allowedTypes,
    onProgress,
    config = {},
  } = options;

  // Validate file
  const validation = validateFile(file, { maxSize, allowedTypes });
  if (!validation.valid) {
    return {
      success: false,
      error: validation.error,
    };
  }

  const formData = new FormData();
  formData.append(fieldName, file);

  try {
    const response = await api.post(endpoint, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config.headers,
      },
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        if (progressEvent.total && onProgress) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Upload failed',
    };
  }
};

export const uploadMultipleFiles = async (
  files: File[],
  options: UploadOptions = {}
): Promise<UploadResult[]> => {
  const uploadPromises = files.map((file) => uploadFile(file, options));
  return Promise.all(uploadPromises);
};

export class UploadController {
  private cancelTokenSource: CancelTokenSource = axios.CancelToken.source();
  private currentProgress = 0;

  async upload(
    file: File,
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    const {
      endpoint = '/upload',
      fieldName = 'file',
      maxSize,
      allowedTypes,
      onProgress,
      config = {},
    } = options;

    // Validate file
    const validation = validateFile(file, { maxSize, allowedTypes });
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error,
      };
    }

    const formData = new FormData();
    formData.append(fieldName, file);

    try {
      const response = await api.post(endpoint, formData, {
        ...config,
        headers: {
          'Content-Type': 'multipart/form-data',
          ...config.headers,
        },
        cancelToken: this.cancelTokenSource.token,
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (progressEvent.total) {
            this.currentProgress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            if (onProgress) {
              onProgress(this.currentProgress);
            }
          }
        },
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      if (axios.isCancel(error)) {
        return {
          success: false,
          error: 'Upload cancelled',
        };
      }
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Upload failed',
      };
    }
  }

  cancel(): void {
    this.cancelTokenSource.cancel('Upload cancelled by user');
    this.cancelTokenSource = axios.CancelToken.source();
  }

  getProgress(): number {
    return this.currentProgress;
  }
}
