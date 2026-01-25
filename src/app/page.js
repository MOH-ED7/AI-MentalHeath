import ChatWindow from "./components/ChatWindow";

export default function Home() {
  return (
    <main style={{ backgroundColor: '#F0F4F8', minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
      <ChatWindow />
    </main>
  );
}
