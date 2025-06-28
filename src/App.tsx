import './App.css';
import { SlackWebhookManager } from './features/slack/SlackWebhookManager';

function App() {
  return (
    <div className="app-container">
      <h1>Slack Webhook Manager</h1>
      <SlackWebhookManager />
    </div>
  );
}

export default App;
