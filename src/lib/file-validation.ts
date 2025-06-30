export interface FileValidationOptions {
  allowedTypes?: string[];
  maxSize?: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  requireFaceDetection?: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  warnings?: string[];
  metadata?: {
    width?: number;
    height?: number;
    size: number;
    type: string;
    name: string;
  };
}

// 默认配置
const DEFAULT_OPTIONS: Required<FileValidationOptions> = {
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  maxSize: 10 * 1024 * 1024, // 10MB
  minWidth: 100,
  minHeight: 100,
  maxWidth: 4096,
  maxHeight: 4096,
  requireFaceDetection: false,
};

// 验证文件类型
export function validateFileType(file: File, allowedTypes: string[]): ValidationResult {
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `Invalid file type "${file.type}". Allowed types: ${allowedTypes.join(', ')}`,
    };
  }
  return { isValid: true };
}

// 验证文件大小
export function validateFileSize(file: File, maxSize: number): ValidationResult {
  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      isValid: false,
      error: `File size ${fileSizeMB}MB exceeds maximum allowed size ${maxSizeMB}MB`,
    };
  }
  return { isValid: true };
}

// 验证图片尺寸
export async function validateImageDimensions(
  file: File,
  options: {
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
  }
): Promise<ValidationResult> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      
      const { width, height } = img;
      const warnings: string[] = [];
      
      // 检查最小尺寸
      if (options.minWidth && width < options.minWidth) {
        return resolve({
          isValid: false,
          error: `Image width ${width}px is below minimum required ${options.minWidth}px`,
        });
      }
      
      if (options.minHeight && height < options.minHeight) {
        return resolve({
          isValid: false,
          error: `Image height ${height}px is below minimum required ${options.minHeight}px`,
        });
      }
      
      // 检查最大尺寸
      if (options.maxWidth && width > options.maxWidth) {
        return resolve({
          isValid: false,
          error: `Image width ${width}px exceeds maximum allowed ${options.maxWidth}px`,
        });
      }
      
      if (options.maxHeight && height > options.maxHeight) {
        return resolve({
          isValid: false,
          error: `Image height ${height}px exceeds maximum allowed ${options.maxHeight}px`,
        });
      }

      // 添加建议性警告
      if (width < 512 || height < 512) {
        warnings.push('Low resolution image may result in poor quality output');
      }
      
      if (width !== height) {
        warnings.push('Non-square image may be cropped or stretched');
      }

      resolve({
        isValid: true,
        warnings: warnings.length > 0 ? warnings : undefined,
        metadata: { width, height, size: file.size, type: file.type, name: file.name },
      });
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({
        isValid: false,
        error: 'Failed to load image. File may be corrupted or invalid.',
      });
    };
    
    img.src = url;
  });
}

// 验证图片内容安全性
export async function validateImageContent(file: File): Promise<ValidationResult> {
  // 基本的文件头验证
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  
  // 检查常见图片格式的文件头
  const isPNG = bytes.length >= 8 && 
    bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47;
  
  const isJPEG = bytes.length >= 3 && 
    bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF;
  
  const isWebP = bytes.length >= 12 && 
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50;

  if (!isPNG && !isJPEG && !isWebP) {
    return {
      isValid: false,
      error: 'File content does not match expected image format',
    };
  }

  return { isValid: true };
}

// 简单的人脸检测验证（基于Canvas API）
export async function validateFacePresence(file: File): Promise<ValidationResult> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        return resolve({
          isValid: false,
          error: 'Canvas not supported for face detection',
        });
      }
      
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      try {
        // 简单的颜色分析来估计是否包含人脸
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        let skinPixels = 0;
        const totalPixels = data.length / 4;
        
        // 简单的肤色检测算法
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          // 简单的肤色范围检测
          if (
            r > 95 && g > 40 && b > 20 &&
            r > g && r > b &&
            Math.abs(r - g) > 15 &&
            Math.max(r, g, b) - Math.min(r, g, b) > 15
          ) {
            skinPixels++;
          }
        }
        
        const skinPercentage = (skinPixels / totalPixels) * 100;
        
        if (skinPercentage < 1) {
          return resolve({
            isValid: false,
            error: 'No face detected in the image. Please ensure the image contains a clear face.',
          });
        }
        
        const warnings: string[] = [];
        if (skinPercentage < 5) {
          warnings.push('Face may be difficult to detect. Consider using a clearer image.');
        }
        
        resolve({
          isValid: true,
          warnings: warnings.length > 0 ? warnings : undefined,
        });
      } catch (error) {
        resolve({
          isValid: false,
          error: 'Failed to analyze image content',
        });
      }
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({
        isValid: false,
        error: 'Failed to load image for face detection',
      });
    };
    
    img.src = url;
  });
}

// 主要的文件验证函数
export async function validateFile(
  file: File,
  options: FileValidationOptions = {}
): Promise<ValidationResult> {
  const config = { ...DEFAULT_OPTIONS, ...options };
  const warnings: string[] = [];
  
  // 基本验证
  const typeResult = validateFileType(file, config.allowedTypes);
  if (!typeResult.isValid) return typeResult;
  
  const sizeResult = validateFileSize(file, config.maxSize);
  if (!sizeResult.isValid) return sizeResult;
  
  // 内容验证
  const contentResult = await validateImageContent(file);
  if (!contentResult.isValid) return contentResult;
  
  // 尺寸验证
  const dimensionsResult = await validateImageDimensions(file, {
    minWidth: config.minWidth,
    minHeight: config.minHeight,
    maxWidth: config.maxWidth,
    maxHeight: config.maxHeight,
  });
  if (!dimensionsResult.isValid) return dimensionsResult;
  
  if (dimensionsResult.warnings) {
    warnings.push(...dimensionsResult.warnings);
  }
  
  // 人脸检测（可选）
  if (config.requireFaceDetection) {
    const faceResult = await validateFacePresence(file);
    if (!faceResult.isValid) return faceResult;
    
    if (faceResult.warnings) {
      warnings.push(...faceResult.warnings);
    }
  }
  
  return {
    isValid: true,
    warnings: warnings.length > 0 ? warnings : undefined,
    metadata: dimensionsResult.metadata,
  };
}

// 专门用于人脸交换的验证配置
export const FACE_SWAP_VALIDATION_OPTIONS: FileValidationOptions = {
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  maxSize: 10 * 1024 * 1024, // 10MB
  minWidth: 256,
  minHeight: 256,
  maxWidth: 2048,
  maxHeight: 2048,
  requireFaceDetection: true,
}; 