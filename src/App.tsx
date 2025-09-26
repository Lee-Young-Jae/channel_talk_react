import { useEffect, useState } from 'react'
import './App.css'

declare global {
  interface Window {
    ChannelIO?: any;
    flutter_inappwebview?: any;
  }
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeChannelTalk = () => {
      if (window.ChannelIO) {
        // Channel Talk 이벤트 리스너 설정
        window.ChannelIO('onShowMessenger', () => {
          setIsLoading(false); // 메신저가 열리면 로딩 숨기기
          if (window.flutter_inappwebview) {
            window.flutter_inappwebview.callHandler('channelTalkOpened');
          }
        });

        window.ChannelIO('onHideMessenger', () => {
          if (window.flutter_inappwebview) {
            window.flutter_inappwebview.callHandler('channelTalkClosed');
          }
        });

        // 웹뷰 로드 시 자동으로 Channel Talk 메신저 열기
        setTimeout(() => {
          window.ChannelIO('showMessenger');
        }, 500); // Channel Talk 초기화를 위한 짧은 지연

        // Flutter에 웹뷰 준비 완료 알림
        if (window.flutter_inappwebview) {
          window.flutter_inappwebview.callHandler('webViewReady');
        }
      } else {
        // Channel Talk이 아직 로드되지 않았다면 재시도
        setTimeout(initializeChannelTalk, 100);
      }
    };

    initializeChannelTalk();

    // Flutter에서 메신저 열기 요청을 받을 수 있도록 전역 함수 등록
    (window as any).openChannelTalk = () => {
      if (window.ChannelIO) {
        window.ChannelIO('showMessenger');
      }
    };

    (window as any).closeChannelTalk = () => {
      if (window.ChannelIO) {
        window.ChannelIO('hideMessenger');
      }
    };
  }, []);

  return (
    <div className="app">
      {isLoading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <div className="loading-text">Channel Talk 로딩 중...</div>
        </div>
      )}
    </div>
  )
}

export default App
