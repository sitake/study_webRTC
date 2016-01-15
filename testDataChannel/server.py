import tornado.ioloop
from tornado.ioloop import PeriodicCallback
import tornado.websocket
import tornado.web
import os
import json


class MainHandler(tornado.web.RequestHandler):
	def get(self):
		if(len(YoutubersSocket.youtuber)==0):
			self.render("youtuber.html")
		else:
			self.render("observer.html")

class YoutubersSocket(tornado.websocket.WebSocketHandler):
	
	youtuber = []

	def open(self):
		if(len(self.__class__.youtuber)==0):
			print("youtuber is comming!")
			self.__class__.youtuber.append(self)

	@classmethod
	def _send_message(clt,message):
		print("to youtuber:"+message)
		map(lambda you:you.write_message(message),clt.youtuber);

	def on_message(self,message):
		ObserversSocket._send_message(message)
		print(json.loads(message).get("type"))

	def on_close(self):
		self.__class__.youtuber.remove(self)
		print("youtuber is got out!")

class ObserversSocket(tornado.websocket.WebSocketHandler):

	observers = dict()

	def open(self,ids):
		self.__class__.observers[ids] = self
		self.ids = ids
		print("observer is comming!")
		print("id:"+ids);

	@classmethod
	def _send_message(clt,message):
		print("to observers:"+message)
#		map(lambda obs:obs.write_message(message),clt.observers)
		clt.observers.get(json.loads(message).get("id")).write_message(message);

	def on_message(self,message):
		YoutubersSocket._send_message(message)

	def on_close(self):
		print("observer is got out!")
		self.__class__.observers.pop(self.ids)

application = tornado.web.Application([
	(r"/",MainHandler),
	(r"/youtuber",YoutubersSocket),
	(r"/observer(........)",ObserversSocket),
	],
	template_path=os.path.join(os.getcwd(),"templates"),
	static_path=os.path.join(os.getcwd(),"src")
)

if __name__ == "__main__":
	application.listen(8888)
	tornado.ioloop.IOLoop.instance().start()
