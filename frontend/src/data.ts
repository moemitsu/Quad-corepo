export const barData = {
    labels: ['第１週', '第２週', '第３週', '第４週'],
    datasets: [
      {
        label: '母',
        data: [6, 8, 7, 5],
      },
      {
        label: '父',
        data: [4, 3, 5, 4],
      },
      {
        label: '祖父母',
        data: [2, 1, 3, 2],
      },
    ],
  };
  
  export const pieData = {
    labels: ['母', '父', '祖父母'],
    datasets: [
      {
        label: '割合',
        data: [70, 20, 10],
      },
    ],
  };
  
  export const colors = [
    'rgba(45, 149, 150, 0.7)',
    'rgba(154, 208, 194, 0.7)',
    'rgba(38, 80, 115, 0.7)',
    // 必要に応じて他の色を追加
  ];
  