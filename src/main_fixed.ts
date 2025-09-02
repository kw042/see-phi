// 黄金比の定数
const GOLDEN_RATIO = 1.618033988749;

// シンプルなメッセージ
const SIMPLE_MESSAGE = "入力画像を黄金比（1:1.618）に変換しました。";

class GoldenRatioApp {
    private uploadArea!: HTMLElement;
    private imageInput!: HTMLInputElement;
    private resultSection!: HTMLElement;
    private originalCanvas!: HTMLCanvasElement;
    private goldenCanvas!: HTMLCanvasElement;
    private originalRatio!: HTMLElement;
    private analysisText!: HTMLElement;
    private uploadBtn!: HTMLElement;
    private regenerateBtn!: HTMLElement;

    constructor() {
        this.initializeElements();
        this.setupEventListeners();
    }

    private initializeElements(): void {
        this.uploadArea = document.getElementById('uploadArea')!;
        this.imageInput = document.getElementById('imageInput') as HTMLInputElement;
        this.resultSection = document.getElementById('resultSection')!;
        this.originalCanvas = document.getElementById('originalCanvas') as HTMLCanvasElement;
        this.goldenCanvas = document.getElementById('goldenCanvas') as HTMLCanvasElement;
        this.originalRatio = document.getElementById('originalRatio')!;
        this.analysisText = document.getElementById('analysisText')!;
        this.uploadBtn = document.getElementById('uploadBtn')!;
        this.regenerateBtn = document.getElementById('regenerateBtn')!;
    }

    private setupEventListeners(): void {
        // ファイル選択
        this.uploadBtn.addEventListener('click', () => {
            this.imageInput.click();
        });

        this.uploadArea.addEventListener('click', () => {
            this.imageInput.click();
        });

        this.imageInput.addEventListener('change', (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                this.processImage(file);
            }
        });

        // ドラッグ&ドロップ
        this.uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.uploadArea.classList.add('dragover');
        });

        this.uploadArea.addEventListener('dragleave', () => {
            this.uploadArea.classList.remove('dragover');
        });

        this.uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            this.uploadArea.classList.remove('dragover');
            const file = e.dataTransfer?.files[0];
            if (file && file.type.startsWith('image/')) {
                this.processImage(file);
            }
        });

        // 再生成ボタン
        this.regenerateBtn.addEventListener('click', () => {
            this.resultSection.style.display = 'none';
            this.imageInput.value = '';
        });
    }

    private processImage(file: File): void {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.displayOriginalImage(img);
                this.createGoldenRatioVersion(img);
                this.generateAnalysis(img);
                this.resultSection.style.display = 'block';
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    }

    private displayOriginalImage(img: HTMLImageElement): void {
        const ctx = this.originalCanvas.getContext('2d')!;
        const maxSize = 300;
        
        let { width, height } = this.calculateDisplaySize(img.width, img.height, maxSize);
        
        this.originalCanvas.width = width;
        this.originalCanvas.height = height;
        
        ctx.drawImage(img, 0, 0, width, height);
        
        const ratio = img.width / img.height;
        this.originalRatio.textContent = `比率: 1:${ratio.toFixed(3)}`;
    }

    private createGoldenRatioVersion(img: HTMLImageElement): void {
        const ctx = this.goldenCanvas.getContext('2d')!;
        const maxSize = 300;
        
        // 元の画像の比率を確認
        const originalRatio = img.width / img.height;
        let goldenWidth: number, goldenHeight: number;
        
        // 縦長の場合は逆の黄金比を適用
        if (originalRatio < 1) {
            goldenWidth = maxSize / GOLDEN_RATIO;
            goldenHeight = maxSize;
        } else {
            goldenWidth = maxSize;
            goldenHeight = maxSize / GOLDEN_RATIO;
        }
        
        this.goldenCanvas.width = goldenWidth;
        this.goldenCanvas.height = goldenHeight;
        
        // 画像を黄金比に強制的に圧縮
        ctx.drawImage(img, 0, 0, goldenWidth, goldenHeight);
        
        // 黄金螺旋を描画
        this.drawGoldenSpiral(ctx, goldenWidth, goldenHeight);
    }

    private drawGoldenSpiral(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        // 黄金長方形から螺旋を描く
        this.drawGoldenSpiralFromRectangles(ctx, width, height);
    }
    
    private drawGoldenSpiralFromRectangles(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        // 黄金長方形の配列を生成
        const rectangles = this.generateGoldenRectangles(width, height);
        
        // まず正方形を描画して構造を確認
        this.drawSquares(ctx, rectangles);
        
        // 螺旋を描画
        ctx.beginPath();
        ctx.strokeStyle = '#fff344ff'; // 螺旋は赤色
        ctx.lineWidth = 2;
        
        // 各長方形に対応する1/4円弧を描く
        for (let i = 0; i < rectangles.length; i++) {
            const rect = rectangles[i]!;
            const radius = Math.min(rect.width, rect.height);
            
            // 長方形内での正方形の位置によって円弧の描画方向を決定
            let centerX, centerY, startAngle, endAngle;
            
            // 螺旋の方向を決定（左下から線を引き始める）
            switch (i % 4) {
                case 0: // 左下から右上
                    centerX = rect.x + radius; // 正方形の右下x座標
                    centerY = rect.y + radius; // 正方形の右下y座標
                    startAngle = Math.PI; // 180° (左方向)
                    endAngle = 1.5 * Math.PI; // 90° (下方向)
                    break;
                case 1: // 右下から左上
                    centerX = rect.x;
                    centerY = rect.y + radius;
                    startAngle = 1.5 * Math.PI; // 90° (下方向)
                    endAngle = 0; // 0° (右方向)
                    break;
                case 2: // 右上から左下
                    centerX = rect.x + rect.width - radius;
                    centerY = rect.y;
                    startAngle = 0; // 0° (右方向)
                    endAngle = 0.5 * Math.PI; // -90° (上方向)
                    break;
                case 3: // 左上から右下
                    centerX = rect.x + radius;
                    centerY = rect.y + rect.height - radius;
                    startAngle = 0.5 * Math.PI; // -90° (上方向)
                    endAngle = Math.PI; // -180° (左方向)
                    break;
                default:
                    centerX = rect.x;
                    centerY = rect.y;
                    startAngle = 0;
                    endAngle = Math.PI / 2;
            }
            
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        }
        
        ctx.stroke();
    }
    
    private drawSquares(ctx: CanvasRenderingContext2D, rectangles: Array<{x: number, y: number, width: number, height: number}>): void {
        ctx.strokeStyle = '#888888'; // 正方形は灰色
        ctx.lineWidth = 1;
        
        // 各長方形内の正方形を描画
        for (let i = 0; i < rectangles.length; i++) {
            const rect = rectangles[i]!;
            const squareSize = Math.min(rect.width, rect.height);
            
            // 正方形の位置を計算
            let squareX, squareY;
            
            switch (i % 4) {
                case 0: // 左側に正方形
                    squareX = rect.x;
                    squareY = rect.y;
                    break;
                case 1: // 上側に正方形
                    squareX = rect.x;
                    squareY = rect.y;
                    break;
                case 2: // 右側に正方形
                    squareX = rect.x + rect.width - squareSize;
                    squareY = rect.y;
                    break;
                case 3: // 下側に正方形
                    squareX = rect.x;
                    squareY = rect.y + rect.height - squareSize;
                    break;
                default:
                    squareX = rect.x;
                    squareY = rect.y;
            }
            
            // 正方形を描画
            ctx.strokeRect(squareX, squareY, squareSize, squareSize);
            
            // // 正方形の中央に番号を表示
            // ctx.fillStyle = '#FF4444'; // 赤色のテキスト
            // ctx.font = `${Math.max(12, squareSize / 8)}px Arial`; // 正方形のサイズに応じてフォントサイズを調整
            // ctx.textAlign = 'center';
            // ctx.textBaseline = 'middle';
            
            // const centerX = squareX + squareSize / 2;
            // const centerY = squareY + squareSize / 2;
            // ctx.fillText((i + 1).toString(), centerX, centerY);
            
            // 長方形も描画（デバッグ用）
            ctx.strokeStyle = '#CCCCCC';
            ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
            ctx.strokeStyle = '#888888';
        }
    }
    
    private generateGoldenRectangles(width: number, height: number): Array<{x: number, y: number, width: number, height: number}> {
        const rectangles: Array<{x: number, y: number, width: number, height: number}> = [];
        
        // 最初の黄金長方形（画像全体）
        let currentRect = { x: 0, y: 0, width: width, height: height };
        
        // 最大10回の分割を行う
        for (let i = 0; i < 10; i++) {
            rectangles.push(currentRect);
            
            // 現在の長方形から正方形を切り出し、残りの長方形を計算
            const nextRect = this.cutSquareFromRectangle(currentRect, i);
            
            // 次の長方形が小さすぎる場合は終了
            if (nextRect.width < 2 || nextRect.height < 2) {
                break;
            }
            
            currentRect = nextRect;
        }
        
        return rectangles;
    }
    
    private cutSquareFromRectangle(rect: {x: number, y: number, width: number, height: number}, iteration: number): {x: number, y: number, width: number, height: number} {
        // 黄金長方形の性質を利用して、正方形を切り出した後の残りの長方形を計算
        const squareSize = Math.min(rect.width, rect.height);
        
        // 螺旋の進行方向に基づいて次の長方形の位置を決定
        switch (iteration % 4) {
            case 0: // 右側の長方形を残す
                return {
                    x: rect.x + squareSize,
                    y: rect.y,
                    width: rect.width - squareSize,
                    height: rect.height
                };
            case 1: // 下側の長方形を残す
                return {
                    x: rect.x,
                    y: rect.y + squareSize,
                    width: rect.width,
                    height: rect.height - squareSize
                };
            case 2: // 左側の長方形を残す
                return {
                    x: rect.x,
                    y: rect.y,
                    width: rect.width - squareSize,
                    height: rect.height
                };
            case 3: // 上側の長方形を残す
                return {
                    x: rect.x,
                    y: rect.y,
                    width: rect.width,
                    height: rect.height - squareSize
                };
            default:
                return rect;
        }
    }

    private generateAnalysis(img: HTMLImageElement): void {
        this.analysisText.innerHTML = `
            <p>${SIMPLE_MESSAGE}</p>
        `;
    }

    private calculateDisplaySize(originalWidth: number, originalHeight: number, maxSize: number): { width: number, height: number } {
        const ratio = originalWidth / originalHeight;
        
        if (originalWidth > originalHeight) {
            return {
                width: maxSize,
                height: maxSize / ratio
            };
        } else {
            return {
                width: maxSize * ratio,
                height: maxSize
            };
        }
    }
}

// アプリケーションの初期化
document.addEventListener('DOMContentLoaded', () => {
    new GoldenRatioApp();
});
