package main

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	//"html"
	//"log"
	"net/http"
	"strconv"
	//"time"
	"database/sql"
	_ "github.com/go-sql-driver/mysql"
	_ "github.com/lib/pq"
	"io/ioutil"
	"log"
)

var (
	todos = Todos{
		Todo{Id: 1, Name: "Event 1"},
		Todo{Id: 2, Name: "Event 2"},
	}
)

func Index(rw http.ResponseWriter, r *http.Request) {
	body, _ := ioutil.ReadFile("index.html")
	fmt.Fprint(rw, string(body))
}

func TodoIndex(rw http.ResponseWriter, r *http.Request) {

	/*********************SETTING HEADERS*********************/
	rw.Header().Set("Content-Type", "application/json;charset=UTF-8")
	rw.WriteHeader(http.StatusOK)
	/*********************************************************/

	if err := json.NewEncoder(rw).Encode(todos); err != nil {
		panic(err)
	}

}

func TodoShow(rw http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	var todoId int
	todoId, _ = strconv.Atoi(vars["todoId"])

	for _, t := range todos {
		if t.Id == todoId {
			if err := json.NewEncoder(rw).Encode(t); err != nil {
				panic(err)
			}
		}
	}
	fmt.Fprintf(rw, "Record with id=%d not present", todoId)

}

func FetchBlogs(rw http.ResponseWriter, r *http.Request) {

	/*********************SETTING HEADERS*********************/
	rw.Header().Set("Content-Type", "application/json;charset=UTF-8")
	rw.WriteHeader(http.StatusOK)
	/*********************************************************/

	/************* DB Connection *************/

	//db, err := sql.Open("mysql","root:root@tcp(127.0.0.1:8889)/GoTest")

	db, err := sql.Open("postgres", "postgres://wgjrelaobwlfug:zCi_9ifZdahE_E7nwFVtul2FRv@ec2-54-83-57-86.compute-1.amazonaws.com:5432/de08tulmlv9ho")
	checkErr(err)

	/*if err != nil {
		log.Fatal(err)
	}

	err = db.Ping()
	if err == nil {
		log.Println("Success connecting to Database!")
	}*/

	/******************************************/

	/************* Reading from DB *************/

	var (
		id     int
		author string
		title  string
		url    string
	)

	rows, err := db.Query("SELECT * from Blog")
	checkErr(err)
	var blogs = Blogs{}

	for rows.Next() {

		err := rows.Scan(&id, &author, &title, &url)
		checkErr(err)

		blog := Blog{Id: id, Author: author, Title: title, Url: url}
		blogs = append(blogs, blog)
	}

	err = rows.Err()
	if err != nil {
		log.Fatal(err)
	}

	if err := json.NewEncoder(rw).Encode(blogs); err != nil {
		panic(err)
	}
	defer rows.Close()

	/******************************************/
	defer db.Close()
}

func PostBlog(rw http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	var blogPost Blog
	err := decoder.Decode(&blogPost)
	if err != nil {
		panic(err)
	}

	/************* Connecting to DB *************/

	db, err := sql.Open("postgres", "postgres://wgjrelaobwlfug:zCi_9ifZdahE_E7nwFVtul2FRv@ec2-54-83-57-86.compute-1.amazonaws.com:5432/de08tulmlv9ho")
	checkErr(err)
	/******************************************/

	/************* Writing to DB *************/

	var lastInsertId int
	//pquery, err := db.Prepare("INSERT INTO Blog(author, title, url) VALUES(?, ?, ?)")
	err = db.QueryRow("INSERT INTO Blog(author, title, url) VALUES($1,$2,$3) returning id;", blogPost.Author, blogPost.Title, blogPost.Url).Scan(&lastInsertId)
	checkErr(err)

	/*res, err := pquery.Exec(blogPost.Author, blogPost.Title, blogPost.Url)
	if err != nil {
		log.Fatal(err)
	}
	_ = res*/
	/*lastId, err := res.LastInsertId()
	if err != nil {
		log.Fatal(err)
	}*/

	fmt.Fprintf(rw, "Success! Inserted:"+string(lastInsertId))

	/******************************************/

	defer db.Close()

}

func checkErr(err error) {
	if err != nil {
		panic(err)
	}
}
