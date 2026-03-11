export const simulateNetworkRequest = async <T,>(
  mockData: T,
  delay: number = 1000,
  failureRate: number = 0.2
): Promise<T> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 模拟网络异常
      if (Math.random() < failureRate) {
        reject(new Error('网络连接异常，请重试'));
      } else {
        resolve(mockData);
      }
    }, delay);
  });
};
