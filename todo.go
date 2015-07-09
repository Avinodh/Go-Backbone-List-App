package main

type Blog struct {
	Id     int    `json:"id"`
	Author string `json:"author"`
	Title  string `json:"title"`
	Url    string `json:"url"`
}

type Blogs []Blog
