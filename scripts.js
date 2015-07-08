// Backbone Model
var Blog = Backbone.Model.extend({
	defaults: {
		author: '',
		title: '', 
		url: ''
	}
}); 

// Backbone Collection
var Blogs = Backbone.Collection.extend({
	url: 'http://localhost:8080/api/blogs'
}); 

// Instantiate two Blog posts
var blog1 = new Blog({author:"Vin", title:"Vin\'s Blog", url:"www.ashvinvinodh.com"});
var blog2 = new Blog({author:"John", title:"John's Blog", url:"www.john.com"});


// Instantiate a Collection
var blogs = new Blogs(); 

// Backbone View for one blog
var BlogView = Backbone.View.extend({
	model: new Blog(),
	tagName: 'tr', 
	initialize: function(){
		this.template = _.template($('.blogs-list-template').html())
	},

	events: {
		'click .edit-blog' : 'edit',
		'click .update-blog' : 'update',
		'click .cancel': 'cancel',
		'click .delete-blog': 'delete'
	},
	edit: function(){
		this.$(".edit-blog").hide(); 
		this.$(".delete-blog").hide(); 
		this.$(".update-blog").show(); 
		this.$(".cancel").show();

		var author = this.$(".author").html(); 
		var title = this.$(".title").html(); 
		var url = this.$(".url").html(); 
 
		this.$(".author").html('<input type="text" class="form-control author-update" value="' + author + '">'); 
		this.$(".title").html('<input type="text" class="form-control title-update" value="' + title + '">');
		this.$(".url").html('<input type="text" class="form-control url-update" value="' + url + '">');
	},

	update: function(){
		this.model.set({'author':this.$(".author-update").val(),
						'title':this.$(".title-update").val(), 
						'url':this.$(".url-update").val()
					}); 
	},

	cancel: function(){
		blogsView.render();
	},

	delete: function(){
		this.model.destroy(); 
	},

	render: function(){
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
}); 

//Backbone View for all Blogs
var BlogsView = Backbone.View.extend({
	model:blogs,  //collection
	el: $('.blogs-list'),
	initialize: function(){ 
		var self = this; 
		this.model.on('add', this.render, this); 
		this.model.on('change', this.render, this);
		this.model.on('remove', this.render, this);

		this.model.fetch({
			success: function(response)
			{
				_.each(response.toJSON(), function(item){
					console.log('Successfully GOT blog with id: ' + item.id);
				}); 
			},

			error: function(){
				console.log('Failed to get blogs.');
			}
		}); 
	}, 
	render: function(){
		var self = this; 
		this.$el.html('');
		_.each(this.model.toArray(), function(blog){
			self.$el.append((new BlogView({model:blog})).render().$el)
		});
		return this; 
	}
}); 

var blogsView = new BlogsView(); 

$(document).ready(function(){

	$(".add-blog").on("click", function(){
		var blog = new Blog({
			author: $(".author-input").val(), 
			title:$(".title-input").val(),
			url:$(".url-input").val()
		});
		$(".author-input").val('');
		$(".title-input").val('');
		$(".url-input").val('');
		console.log(blog.toJSON()); 
		blogs.add(blog); 
		blog.save(null, {
			success: function(response){
				//console.log('Successfuly saved blog with id: '+ response.toJSON().id);
				console.log(response); 
			},
			error: function(response) {
				console.log("Error: " + response); 
			}
		});
	});
});