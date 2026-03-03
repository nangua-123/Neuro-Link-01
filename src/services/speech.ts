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
  private isSupported: boolean = false;

  constructor() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.isSupported = true;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true; // 持续监听直到手动停止
      this.recognition.interimResults = true; // 返回中间结果
      this.recognition.lang = 'zh-CN'; // 默认中文
    } else {
      console.warn('当前浏览器不支持 Web Speech API，将使用 Mock 数据');
    }
  }

  /**
   * 开始语音识别 (Promise 封装)
   * 返回最终识别的完整文本
   */
  public startListening(): Promise<SpeechResult> {
    return new Promise((resolve, reject) => {
      // 如果不支持，直接使用 Mock
      if (!this.isSupported || !this.recognition) {
        this.isListening = true;
        setTimeout(() => {
          this.isListening = false;
          resolve({ text: '（模拟语音识别内容）最近总是头痛，像针扎一样，还怕光。', confidence: 0.99, isFinal: true });
        }, 2000);
        return;
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
        
        // 如果是 network 错误（常见于 iframe 或无网络环境），降级使用 Mock 数据
        if (event.error === 'network' || event.error === 'not-allowed') {
          console.warn('语音识别失败，降级使用 Mock 数据');
          resolve({ text: '（模拟语音识别内容）最近总是头痛，像针扎一样，还怕光。', confidence: 0.99, isFinal: true });
        } else {
          reject(event.error);
        }
      };

      this.recognition.onend = () => {
        this.isListening = false;
        // 如果没有识别到内容，也给个默认的，防止流程卡死
        if (!finalTranscript) {
           resolve({ text: '（模拟语音识别内容）最近总是头痛，像针扎一样，还怕光。', confidence: 0.99, isFinal: true });
        } else {
           resolve({ text: finalTranscript, confidence: 1, isFinal: true });
        }
      };

      try {
        this.recognition.start();
        this.isListening = true;
      } catch (e) {
        console.error('Failed to start speech recognition', e);
        // 启动失败也降级
        setTimeout(() => {
          this.isListening = false;
          resolve({ text: '（模拟语音识别内容）最近总是头痛，像针扎一样，还怕光。', confidence: 0.99, isFinal: true });
        }, 2000);
      }
    });
  }

  /**
   * 停止语音识别
   */
  public stopListening(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
      this.isListening = false;
    }
  }

  public getIsListening(): boolean {
    return this.isListening;
  }
}

// 导出一个单例实例供全局使用
export const speechService = new SpeechService();
