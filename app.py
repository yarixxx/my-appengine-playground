#!/usr/bin/env python

import os
import urllib
import json

from google.appengine.api import users
from google.appengine.ext import ndb

import webapp2

class Item(ndb.Model):
  title = ndb.StringProperty()
  text = ndb.StringProperty()

class DeleteItem(webapp2.RequestHandler):
    def delete(self):
	print self.request.body
        # data = json.loads(self.request.body)


class CreateItem(webapp2.RequestHandler):
    def post(self):
	data = json.loads(self.request.body)
	title = data.get('title')
	text = data.get('text')
	item = Item(title=title, text=text)
	item.put() 

class ListItems(webapp2.RequestHandler):

    def get(self):
	self.response.headers['Content-Type'] = 'application/json'
	query = Item.query()
	items = query.fetch()
	dict_items = []
	for item in items:
	    dict_item = item.to_dict()
	    dict_item['id'] = item.key.urlsafe()
	    dict_items.append(dict_item)
	print dict_items 
	data = {
	  'items': dict_items	
	}
        self.response.write(json.dumps(data))


app = webapp2.WSGIApplication([
    ('/backend/list_items', ListItems),
    ('/backend/delete_item', DeleteItem),
    ('/backend/create_item', CreateItem),
], debug=True)
