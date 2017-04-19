from src.controller import Controller


class SocketContainer():
    # This only exists because
    # I want to do some pubsub scoping logic
    # And it doesnt belong in the controller
    hub = None
    ws = None

    def __init__(self, hub, ws):
        self.ws = ws

    def handle(self, db, message):
        controller = Controller(db, self.hub, message)
        res = controller.handle()
        self.ws.send(res)


class Hub():
    sockets = []

    def add(self, ws):
        socket = SocketContainer(self, ws)
        self.sockets.append(socket)
        return socket