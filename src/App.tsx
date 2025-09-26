import { useEffect } from 'react'
import './App.css'

declare global {
  interface Window {
    ChannelIO?: any;
    flutter_inappwebview?: any;
  }
}

function App() {
  useEffect(() => {
    // Channel Talk 이벤트 리스너
    if (window.ChannelIO) {
      window.ChannelIO('onShowMessenger', () => {
        // Flutter에 메신저 열림 알림
        if (window.flutter_inappwebview) {
          window.flutter_inappwebview.callHandler('channelTalkOpened');
        }
      });

      window.ChannelIO('onHideMessenger', () => {
        // Flutter에 메신저 닫힘 알림
        if (window.flutter_inappwebview) {
          window.flutter_inappwebview.callHandler('channelTalkClosed');
        }
      });
    }

    // Flutter에서 웹뷰 로드 완료 알림
    if (window.flutter_inappwebview) {
      window.flutter_inappwebview.callHandler('webViewReady');
    }
  }, []);

  return (
    <div className="app">
      {/* 최소한의 UI - Channel Talk만 보이도록 */}
      <div className="channel-talk-container">
        <div className="placeholder-text">
          Channel Talk
        </div>
      </div>
    </div>
  )
}

export default App
