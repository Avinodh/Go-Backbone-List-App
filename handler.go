package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
	"io/ioutil"
	"log"
	"net/http"
	"os"
)

func Index(rw http.ResponseWriter, r *http.Request) {
	body, _ := ioutil.ReadFile("index.html")
	fmt.Fprint(rw, string(body))
}

func FetchBlogs(rw http.ResponseWriter, r *http.Request) {

	/*********************SETTING HEADERS*********************/
	rw.Header().Set("Content-Type", "application/json;charset=UTF-8")
	rw.WriteHeader(http.StatusOK)
	/*********************************************************/

	/************* DB Connection *************/

	//db, err := sql.Open("mysql","root:root@tcp(127.0.0.1:8889)/GoTest")

	db, err := sql.Open("postgres", os.Getenv("DATABASE_URL"))
	checkErr(err)

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

	db, err := sql.Open("postgres", os.Getenv("DATABASE_URL"))
	checkErr(err)
	/******************************************/

	/************* Writing to DB *************/

	var lastInsertId int
	//pquery, err := db.Prepare("INSERT INTO Blog(author, title, url) VALUES(?, ?, ?)")
	err = db.QueryRow("INSERT INTO Blog(author, title, url) VALUES($1,$2,$3) returning id;", blogPost.Author, blogPost.Title, blogPost.Url).Scan(&lastInsertId)
	checkErr(err)

	fmt.Fprintf(rw, "Success! Inserted:"+string(lastInsertId))

	/******************************************/

	defer db.Close()

}

func UpdateBlog(rw http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	decoder := json.NewDecoder(r.Body)
	var blogPost Blog
	err := decoder.Decode(&blogPost)
	if err != nil {
		panic(err)
	}

	/************* Connecting to DB *************/

	db, err := sql.Open("postgres", os.Getenv("DATABASE_URL"))
	checkErr(err)
	/******************************************/

	/************* Updating DB *************/

	pquery, err := db.Prepare("UPDATE Blog SET author=$1, title=$2, url=$3  WHERE id=$4")
	checkErr(err)

	_, e := pquery.Exec(blogPost.Author, blogPost.Title, blogPost.Url, id)
	checkErr(e)

	fmt.Fprintf(rw, "Updated")

	/******************************************/

	defer db.Close()

}

func DeleteBlog(rw http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	/************* Connecting to DB *************/

	db, err := sql.Open("postgres", os.Getenv("DATABASE_URL"))
	checkErr(err)
	/******************************************/

	/************* Deleting from DB *************/

	pquery, err := db.Prepare("DELETE FROM Blog WHERE id=$1")
	checkErr(err)

	_, e := pquery.Exec(id)
	checkErr(e)

	fmt.Fprintf(rw, "Deleted:"+string(id))

	/******************************************/

	defer db.Close()

}

func checkErr(err error) {
	if err != nil {
		panic(err)
	}
}
