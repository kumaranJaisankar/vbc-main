import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
import MySQLdb
from django.core.serializers.json import DjangoJSONEncoder
from radius.views import select,update

class UserListConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['roomid']
        self.room_group_name = 'grp_%s' % self.room_name
        # Join room group
        print(self.channel_name)
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        self.accept()

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )
        print('disconnected...')
    
    # Receive message from WebSocket
    def receive(self, text_data):
        print(text_data)
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'heartbeat'
            }
        )

    # Receive message from room group
    def heartbeat(self, event):
        #query="set sql_mode='';"
        #update(query)
        #dbconnection =MySQLdb.connect(host="127.0.0.1",user="root",db="radius",port=33333, passwd="Mydb2p2ssSEC_p255")
        #cursor1=dbconnection.cursor()
        query1 = f"SELECT username, radacctid, acctstoptime, acctstarttime, nasporttype FROM radacct WHERE radacctid IN (SELECT MAX(radacctid) FROM radacct GROUP BY username);"
        #cursor1.execute(query1)
    
        data1 = select(query1)
        data = []
        for i in data1:
            #cursor2=dbconnection.cursor()
            query2 = f"SELECT username, radacctid, acctstoptime, acctstarttime, nasporttype, SUM(acctinputoctets) as acctinputoctets, SUM(acctoutputoctets) as acctoutputoctets FROM radacct WHERE username='{i['username']}';"
            #cursor2.execute(query2)
            data.append(select(query2)[0])
        data2 = []
        for i in zip(data, data1):
            data2.append({
                "username": i[1]['username'],
                "radacctid": i[1]['radacctid'],
                "acctstoptime": i[1]['acctstoptime'],
                "acctstarttime": i[1]['acctstarttime'],
                "nasporttype": i[1]['nasporttype'],
                "acctinputoctets": i[0]['acctinputoctets'],
                "acctoutputoctets": i[0]['acctoutputoctets']
            })

        self.send(text_data=json.dumps(data2, cls=DjangoJSONEncoder))

    def dictfetchall(self, cursor):
        columns = [col[0] for col in cursor.description]
        return [
            dict(zip(columns, row))
            for row in cursor.fetchall()
        ]

