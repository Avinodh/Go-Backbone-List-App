package main

import "time"

type Todo struct {
	Id        int       `json:"id"`
	Name      string    `json:"name"`
	Completed bool      `json:"completed"`
	Due       time.Time `json:"due"`
}

type Blog struct {
	Id     int    `json:"id"`
	Author string `json:"author"`
	Title  string `json:"title"`
	Url    string `json:"url"`
}

type Todos []Todo
type Blogs []Blog
