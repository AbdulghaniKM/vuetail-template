import api from '@/plugins/axios';
import axios, {
  type AxiosProgressEvent,
  type AxiosRequestConfig,
  type CancelTokenSource,
  isAxiosError,
} from 'axios';
import { API_PATHS } from '@/config/api-paths';
import { formatFileSize, getFileExtension } from '@/utils/file';

export interface UploadOptions {
  endpoint?: string;
  fieldName?: string;
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  onProgress?: (progress: number) => void;
  config?: AxiosRequestConfig;
}

export interface UploadResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export const validateFile = (
  file: File,
  options: { maxSize?: number; allowedTypes?: string[] } = {},
): FileValidationResult => {
  const { maxSize, allowedTypes } = options;

  if (maxSize && file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds maximum allowed size of ${formatFileSize(maxSize)}`,
    };
  }

  if (allowedTypes && allowedTypes.length > 0) {
    const fileType = file.type || '';
    const fileExtension = getFileExtension(file.name);
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

const describeUploadFailure = (failure: unknown): string => {
  if (isAxiosError(failure)) {
    const responsePayload = failure.response?.data as { message?: string } | undefined;
    return responsePayload?.message ?? failure.message ?? 'Upload failed';
  }
  if (failure instanceof Error) return failure.message;
  return 'Upload failed';
};

export const uploadFile = async <T = unknown>(
  file: File,
  options: UploadOptions = {},
): Promise<UploadResult<T>> => {
  const {
    endpoint = API_PATHS.UPLOAD,
    fieldName = 'file',
    maxSize,
    allowedTypes,
    onProgress,
    config = {},
  } = options;

  const fileValidationOutcome = validateFile(file, { maxSize, allowedTypes });
  if (!fileValidationOutcome.valid) {
    return {
      success: false,
      error: fileValidationOutcome.error,
    };
  }

  const formData = new FormData();
  formData.append(fieldName, file);

  try {
    const httpResponse = await api.post(endpoint, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config.headers,
      },
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        if (progressEvent.total && onProgress) {
          const progressPercent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progressPercent);
        }
      },
    });

    return {
      success: true,
      data: httpResponse.data as T,
    };
  } catch (failure: unknown) {
    return {
      success: false,
      error: describeUploadFailure(failure),
    };
  }
};

export const uploadMultipleFiles = async <T = unknown>(
  files: File[],
  options: UploadOptions = {},
): Promise<UploadResult<T>[]> => {
  const uploadPromises = files.map((file) => uploadFile<T>(file, options));
  return Promise.all(uploadPromises);
};

export class MultipartUpload<TResponsePayload = unknown> {
  private cancelTokenSource: CancelTokenSource = axios.CancelToken.source();
  private latestReportedProgressPercent = 0;

  async upload(file: File, options: UploadOptions = {}): Promise<UploadResult<TResponsePayload>> {
    const {
      endpoint = API_PATHS.UPLOAD,
      fieldName = 'file',
      maxSize,
      allowedTypes,
      onProgress,
      config = {},
    } = options;

    const fileValidationOutcome = validateFile(file, { maxSize, allowedTypes });
    if (!fileValidationOutcome.valid) {
      return {
        success: false,
        error: fileValidationOutcome.error,
      };
    }

    const formData = new FormData();
    formData.append(fieldName, file);

    try {
      const httpResponse = await api.post(endpoint, formData, {
        ...config,
        headers: {
          'Content-Type': 'multipart/form-data',
          ...config.headers,
        },
        cancelToken: this.cancelTokenSource.token,
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (progressEvent.total) {
            this.latestReportedProgressPercent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            if (onProgress) {
              onProgress(this.latestReportedProgressPercent);
            }
          }
        },
      });

      return {
        success: true,
        data: httpResponse.data as TResponsePayload,
      };
    } catch (failure: unknown) {
      if (axios.isCancel(failure)) {
        return {
          success: false,
          error: 'Upload cancelled',
        };
      }
      return {
        success: false,
        error: describeUploadFailure(failure),
      };
    }
  }

  cancel(): void {
    this.cancelTokenSource.cancel('Upload cancelled by user');
    this.cancelTokenSource = axios.CancelToken.source();
  }

  getProgress(): number {
    return this.latestReportedProgressPercent;
  }
}

/** @deprecated Use {@link MultipartUpload}. */
export const UploadController = MultipartUpload;
