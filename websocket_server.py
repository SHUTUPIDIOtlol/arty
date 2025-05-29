const socket = new WebSocket("wss://arty-production-543b.up.railway.app");

socket.addEventListener('open', () => {
  console.log('✅ Connected to WebSocket server');
  // Example send
  // socket.send("hello world");
});

socket.addEventListener('message', (event) => {
  console.log('📨 Message from server:', event.data);
});

socket.addEventListener('close', () => {
  console.log('❌ WebSocket connection closed');
});

socket.addEventListener('error', (err) => {
  console.error('⚠️ WebSocket error:', err);
});
