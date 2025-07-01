/**
 * 水印添加工具函数
 */

interface WatermarkOptions {
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  opacity?: number;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center';
  margin?: number;
  rotation?: number;
}

const DEFAULT_WATERMARK_OPTIONS: Required<WatermarkOptions> = {
  text: 'Swapify.AI - 升级会员免水印',
  fontSize: 32,
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  color: '#ffffff',
  opacity: 0.9,
  position: 'bottom-right',
  margin: 25,
  rotation: 0,
};

/**
 * 为图片添加水印
 * @param imageUrl 图片URL
 * @param options 水印选项
 * @returns Promise<string> 带水印的图片URL
 */
export async function addWatermarkToImage(
  imageUrl: string,
  options: WatermarkOptions = {}
): Promise<string> {
  const opts = { ...DEFAULT_WATERMARK_OPTIONS, ...options };
  
  return new Promise((resolve, reject) => {
    // 创建图片元素
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      try {
        // 创建Canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        // 设置Canvas尺寸
        canvas.width = img.width;
        canvas.height = img.height;
        
        // 绘制原图
        ctx.drawImage(img, 0, 0);
        
        // 设置水印样式
        ctx.save();
        
        // 计算水印位置
        const { x, y } = calculateWatermarkPosition(
          canvas.width,
          canvas.height,
          opts.text,
          opts.fontSize,
          opts.position,
          opts.margin,
          ctx
        );
        
        // 移动到水印位置
        ctx.translate(x, y);
        
        // 旋转
        if (opts.rotation !== 0) {
          ctx.rotate((opts.rotation * Math.PI) / 180);
        }
        
        // 设置文字样式
        ctx.font = `bold ${opts.fontSize}px ${opts.fontFamily}`;
        ctx.fillStyle = opts.color;
        ctx.globalAlpha = opts.opacity;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // 添加更专业的阴影效果，提升品牌感
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 6;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        // 绘制水印文字
        ctx.fillText(opts.text, 0, 0);
        
        ctx.restore();
        
        // 转换为blob URL
        canvas.toBlob((blob) => {
          if (blob) {
            const watermarkedUrl = URL.createObjectURL(blob);
            resolve(watermarkedUrl);
          } else {
            reject(new Error('Failed to create blob'));
          }
        }, 'image/png', 0.9);
        
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    // 如果是data URL，直接设置
    if (imageUrl.startsWith('data:')) {
      img.src = imageUrl;
    } else {
      // 对于外部URL，可能需要代理处理CORS
      img.src = imageUrl;
    }
  });
}

/**
 * 计算水印位置
 */
function calculateWatermarkPosition(
  canvasWidth: number,
  canvasHeight: number,
  text: string,
  fontSize: number,
  position: string,
  margin: number,
  ctx: CanvasRenderingContext2D
): { x: number; y: number } {
  // 测量文字尺寸
  ctx.font = `bold ${fontSize}px Inter, Arial`;
  const textMetrics = ctx.measureText(text);
  const textWidth = textMetrics.width;
  const textHeight = fontSize;
  
  // 动态调整边距，确保文字不会超出画布
  const adaptiveMargin = Math.max(margin, Math.min(textWidth * 0.1, 50));
  
  let x: number;
  let y: number;
  
  switch (position) {
    case 'top-left':
      x = adaptiveMargin + textWidth / 2;
      y = adaptiveMargin + textHeight / 2;
      break;
    case 'top-right':
      x = canvasWidth - adaptiveMargin - textWidth / 2;
      y = adaptiveMargin + textHeight / 2;
      break;
    case 'bottom-left':
      x = adaptiveMargin + textWidth / 2;
      y = canvasHeight - adaptiveMargin - textHeight / 2 - 30; // 上移30像素
      break;
    case 'bottom-right':
      x = canvasWidth - adaptiveMargin - textWidth / 2;
      y = canvasHeight - adaptiveMargin - textHeight / 2 - 30; // 上移30像素
      break;
    case 'center':
      x = canvasWidth / 2;
      y = canvasHeight / 2;
      break;
    default:
      x = canvasWidth - adaptiveMargin - textWidth / 2;
      y = canvasHeight - adaptiveMargin - textHeight / 2 - 30; // 上移30像素
  }
  
  return { x, y };
}

/**
 * 清理之前创建的blob URL
 */
export function cleanupBlobUrl(url: string): void {
  if (url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
} 