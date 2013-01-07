import sys
 
from twisted.internet import reactor
from twisted.python import log
 
from autobahn.websocket import WebSocketServerFactory, WebSocketServerProtocol, listenWS

clients = []
 
class DashBroadcastProtocol(WebSocketServerProtocol):

    def onOpen(self):
      ''' Ready to accept messages '''
      global clients
      print 'Store client', self
      clients.append(self)

    def onClose(self, wasClean, code, reason):
      ''' When a connection has been closed '''
      print 'Close client. clean:', wasClean, code, reason


    def onMessage(self, msg, binary):
        print "sending echo:", msg
        self.sendMessage(msg, binary)
 
 
if __name__ == '__main__':
    log.startLogging(sys.stdout)
    factory = WebSocketServerFactory("ws://0.0.0.0:9000", debug = False)
    factory.protocol = DashBroadcastProtocol
    listenWS(factory) 
    reactor.run()