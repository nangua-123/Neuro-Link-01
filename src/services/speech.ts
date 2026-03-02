// File: src/services/speech.ts

// 扩展 Window 接口以支持 Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export interface SpeechResult {
  text: string;
  confidence: number;
  isFinal: boolean;
}

export class SpeechService {
  private recognition: any = null;
  private isListening: boolean = false;

  constructor() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true; // 持续监听直到手动停止
      this.recognition.interimResults = true; // 返回中间结果
      this.recognition.lang = 'zh-CN'; // 默认中文
    } else {
      console.warn('当前浏览器不支持 Web Speech API');
    }
  }

  /**
   * 开始语音识别 (Promise 封装)
   * 返回最终识别的完整文本
   */
  public startListening(): Promise<SpeechResult> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        return reject(new Error('浏览器不支持语音识别'));
      }

      if (this.isListening) {
        this.stopListening();
      }

      let finalTranscript = '';

      this.recognition.onresult = (event: any) => {
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
      };

      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        this.isListening = false;
        reject(event.error);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        resolve({ text: finalTranscript, confidence: 1, isFinal: true });
      };

      try {
        this.recognition.start();
        this.isListening = true;
      } catch (e) {
        console.error('Failed to start speech recognition', e);
        reject(e);
      }
    });
  }

  /**
   * 停止语音识别
   */
  public stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  public getIsListening(): boolean {
    return this.isListening;
  }
}

// 导出一个单例实例供全局使用
export const speechService = new SpeechService();
