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
	items = [item.to_dict() for item in query.fetch()]
	print items 
	data = {
	  'items': items	
	}
        self.response.write(json.dumps(data))


app = webapp2.WSGIApplication([
    ('/backend/list_items', ListItems),
    ('/backend/create_item', CreateItem),
], debug=True)
