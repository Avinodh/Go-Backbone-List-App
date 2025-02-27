// Hackathon Model
var Hackathon = Backbone.Model.extend({
	defaults: {
		name: '', 
		organiser: '', 
		location: '',
		date: '',
		image: '', 
		url: ''
	}	
});

// Hackathon Collection
var Hackathons = Backbone.Collection.extend({
	url: '/api/hackathons' 
});

// Instantiate a new hackathon Collection
var hackathons = new Hackathons(); 
var original = new Hackathons(); 
original = _.clone(hackathons);

//View for one Hackathon
var HackathonView = Backbone.View.extend({
	model: new Hackathon(), 
	tagName: 'span', 
	initialize: function(){
		this.template = _.template($('.hackathons-list-template').html())
	}, 
	render: function(){
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});

//View for all hackathons
var HackathonsView = Backbone.View.extend({
	model:hackathons,  //collection
	el: $('.hackathons-list'),
	initialize: function(){ 
		var self = this; 
		this.model.on('add', this.render, this); 
		this.model.on('change', this.render, this);
		this.model.on('reset', this.render, this);
		this.model.fetch({
			success: function(response)
			{
				_.each(response.toJSON(), function(item){
					console.log('Successfully GOT hackathon: ' + item.id +' '+ item.name);
				}); 

			},

			error: function(){
				console.log('Failed to get hackathons.');
			}
		}); 

	}, 
	render: function(){
		var self = this; 
		this.$el.html(''); 
		_.each(this.model.toArray(), function(hack){
			self.$el.append((new HackathonView({model:hack})).render().$el);
		});
		return this; 
	}
});


 
/*

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
	url: '/api/blogs'
}); 

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
		this.model.save(null, {
			success: function(response){
				console.log("Successfully UPDATED"); 
			},
			error: function(){
				console.log("Error"); 
			}
		}); 
	},

	cancel: function(){
		blogsView.render();
	},

	delete: function(){
		this.model.destroy({
			success: function(response)
			{
				console.log("Successfully DELETED blog");
			},
			error: function(){
				console.log("Failed to DELETE"); 
			}
		}); 
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
}); */

//var blogsView = new BlogsView(); 
var hackathonsView = new HackathonsView();


function getListByName(){
	/*var search_val = $(".search-query").val();
				$.get('/api/search', {query: search_val}, function(data) {
					console.log(search_val);
					console.log(data);  
				});*/
	var query_string = $("#search-name .search-query").val(); 
	var results = new Hackathons();
	original.each(function(model){
			if(model.toJSON().name.toLowerCase().indexOf(query_string.toLowerCase()) != -1)
			{
				results.add(model);
				//var hackathonsView = new HackathonsView({model:results});
				//console.log(model.toJSON().name); 
			}
		});
	hackathons.reset(results.toJSON());	
}

function getListByLocation(){
	var query_string = $("#search-location .search-query").val(); 
	var results = new Hackathons();
	original.each(function(model){
			if(model.toJSON().location.toLowerCase().indexOf(query_string.toLowerCase()) != -1)
			{
				results.add(model);
				//var hackathonsView = new HackathonsView({model:results});
				//console.log(model.toJSON().name); 
			}
		});
	hackathons.reset(results.toJSON());	
}


$(document).ready(function(){
	particlesJS.load('particles-js', '/particles.js-master/particles.json', function() {
  console.log('callback - particles.js config loaded');
	});
});

$(document).ready(function(){

	$(".add-hackathon").on("click", function(){
		if($(".name-input").val() == '' || $(".location-input").val() == '' || $(".date-input").val() == ''){
			alert('Incomplete fields');
		}
		else{
			var hackathon = new Hackathon({
				name: $(".name-input").val(), 
				organiser: $(".organiser-input").val(),
				location: $(".location-input").val(),
				date: $(".date-input").val(),
				image: $(".image-input").val(),
				url: $(".url-input").val()

			});
		
			$(".name-input").val('');
			$(".organiser-input").val('');
			$(".location-input").val('');
			$(".date-input").val('');
			$(".image-input").val('');
			$(".url-input").val('');

			console.log(hackathon.toJSON()); 
			hackathons.add(hackathon); 
			original.add(hackathon);
			hackathon.save(null, {
				success: function(response){
					//console.log('Successfuly saved blog with id: '+ response.toJSON().id);
					console.log(response); 
				},
				error: function(response) {
					console.log("Error: " + response); 
				}
			});
		}
	});
});

