

export interface PieChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }[];
}
export interface BarChartData {
  summary(summary: any): unknown;
  labels: string[]; // 日付のラベル配列
  datasets: BarDataset[]; // データセットの配列
}

export interface BarDataset {
  label: string; // データセットのラベル
  data: number[]; // 各日付ごとのデータの配列
  backgroundColor: string[]; // 各棒の背景色の配列
  borderColor: string[]; // 各棒の枠線色の配列
  borderWidth: number; // 各棒の枠線の幅
}
  
  export const colors = [
    'rgba(45, 149, 150, 0.7)',
    'rgba(154, 208, 194, 0.7)',
    'rgba(38, 80, 115, 0.7)',
    'rgba(201, 128, 84, 0.7)',
    'rgba(149, 88, 152, 0.7)',
    'rgba(212, 176, 98, 0.7)',
    'rgba(105, 200, 162, 0.7)',
    'rgba(75, 125, 175, 0.7)',   
    'rgba(115, 175, 195, 0.7)', 
    'rgba(95, 150, 180, 0.7)',  
    // 必要に応じて他の色を追加
  ];
  