import React, { useState, FormEvent } from 'react';
import axios from 'axios';

interface ChatLogEntry {
  type: 'user' | 'bot';
  text: string;
}

const ChatBot: React.FC = () => {
  // ユーザーの入力を管理
  const [inputText, setInputText] = useState<string>('');
  // チャットログを管理
  const [chatLog, setChatLog] = useState<ChatLogEntry[]>([]);

  // ユーザーのログを追加する関数
  const addUserLog = (text: string) => {
    setChatLog(prevLog => [...prevLog, { type: 'user', text }]);
  };

  // ボットのログを追加する関数
  const addBotLog = (text: string) => {
    setChatLog(prevLog => [...prevLog, { type: 'bot', text }]);
  }

  // フォーム送信時の処理
  const handleSubmit = async (e:FormEvent) => {
    e.preventDefault();

    // ユーザーのログを追加
    addUserLog(inputText);

    try {
      // Djangoのバックエンドにリクエストを送信
      const botResponseUrl = window.reverse('bot_response');
      const response = await axios.post(botResponseUrl, {
        input_text: inputText,
      });
      const botResponse = response.data.bot_response;
      addBotLog(botResponse);
    } catch (e) {
      console.error('Error:', e);
      addBotLog('エラーが発生しました。もう一度お試しください。');
    }

    // フォームをクリア
    setInputText('');
  };

  return (
    <div className="container m-auto">
      <header className="p-3">
        <h1>AI Chat Bot</h1>
      </header>

      <main className="p-3 border border-info">
        {/* チャットログの表示 */}
        <section className="chat-log log-window">
          {chatLog.map((log, index) => (
            <p key={index} className={log.type === 'user' ? 'chat-text-color1' : 'chat-text-color2'}>
              <span>{log.text}</span>
            </p>
          ))}
        </section>

      {/* 入力フォーム */}
      <section>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <button className="btn btn-success" type="submit">送信</button>
            <input
              type="text"
              name="input_text"
              className="form-control"
              placeholder="入力"
              aria-describedby="basic-addon1"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>
        </form>
      </section>
    </main>

    <footer className="p-3 text-center">
      <button className="btn btn-primary" onClick={() => setChatLog([])}>リセット</button>
    </footer>
  </div>
  );
}

export default ChatBot;