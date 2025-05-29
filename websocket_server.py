import asyncio
import websockets
import os

clients = set()

async def handler(ws):
    clients.add(ws)
    try:
        async for message in ws:
            for client in clients:
                if client != ws:
                    await client.send(message)
    except:
        pass
    finally:
        clients.remove(ws)

async def main():
    port = int(os.getenv("PORT", 8080))
    async with websockets.serve(handler, "0.0.0.0", port):
        print(f"WebSocket server started on port {port}")
        await asyncio.Future()  # run forever

asyncio.run(main())
