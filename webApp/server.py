import tornado.ioloop
from tornado.ioloop import PeriodicCallback
import tornado.websocket
import tornado.web
import os
import json


class MainHandler(tornado.web.RequestHandler):
	def get(self):
			self.render("index.html")

class YoutubersSocket(tornado.websocket.WebSocketHandler):
	
	youtubers = dict()

	def open(self,ids):
	    print("youtuber is comming!")
	    print("id:"+ids)
	    self.__class__.youtubers[ids] = self
	    self.ids = ids

	@classmethod
	def _send_message(clt,message):
#		print("to youtuber:"+message)
		clt.youtubers.get(json.loads(message).get("to")).write_message(message)

	def on_message(self,message):
		ObserversSocket._send_message(message)

	def on_close(self):
		print("youtuber is got out!")
		self.__class__.youtubers.pop(self.ids)
class ObserversSocket(tornado.websocket.WebSocketHandler):

	observers = dict()

	def open(self,ids):
		self.__class__.observers[ids] = self
		self.ids = ids
		print("observer is comming!")
		print("id:"+ids)

	@classmethod
	def _send_message(clt,message):
#		print("to observers:"+message)
		clt.observers.get(json.loads(message).get("to")).write_message(message)

	def on_message(self,message):
		YoutubersSocket._send_message(message)

	def on_close(self):
		print("observer is got out!")
		self.__class__.observers.pop(self.ids)

class RoomInfoSocket(tornado.websocket.WebSocketHandler):
    
    roominfos = dict()

    def open(self,ids):
        self.ids = ids

    def on_message(self,message):
        self.__class__.roominfos[self.ids] = json.loads(message)
        GetRoomInfoSocket.reloads()

    @classmethod
    def _get_roomInfos(clt):
        return clt.roominfos

    def on_close(self):
        self.__class__.roominfos.pop(self.ids)
        GetRoomInfoSocket.reloads()

class GetRoomInfoSocket(tornado.websocket.WebSocketHandler):

    instances = []

    def open(self):
        self.__class__.instances.append(self)

    def on_message(self,message):
        self.sendRoomInfo()

    def sendRoomInfo(self):
        self.write_message(json.dumps(RoomInfoSocket._get_roomInfos()))

    @classmethod
    def reloads(clt):
        map(lambda soc:soc.sendRoomInfo(),clt.instances)
        

    def on_close(self):
        self.__class__.instances.remove(self)
        print("checkout")

application = tornado.web.Application([
	(r"/",MainHandler),
	(r"/youtuber(........)",YoutubersSocket),
	(r"/observer(........)",ObserversSocket),
        (r"/roominfo(........)",RoomInfoSocket),
        (r"/getRoomInfo",GetRoomInfoSocket),
	],
	template_path=os.path.join(os.getcwd(),"templates"),
	static_path=os.path.join(os.getcwd(),"src")
)

if __name__ == "__main__":
	application.listen(8888)
	tornado.ioloop.IOLoop.instance().start()
