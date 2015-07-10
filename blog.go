package main

type Blog struct {
	Id     int    `json:"id"`
	Author string `json:"author"`
	Title  string `json:"title"`
	Url    string `json:"url"`
}

type Hackathon struct {
	Id        int    `json:"id"`
	Name      string `json:"name"`
	Organiser string `json:"organiser"`
	Location  string `json:"location"`
	Date      string `json:"date"`
	Image     string `json:"image"`
	Url       string `json:"url"`
}

type Blogs []Blog
type Hackathons []Hackathon
