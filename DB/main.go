package main

import (
	"database/sql"
	"net/http"

	_ "github.com/lib/pq"

	"github.com/benjaminRoberts01375/Gift-Guardian/DB/models"
	Coms "github.com/benjaminRoberts01375/Go-Communicate"
)

var database *sql.DB
var config models.Config

func main() {
	Coms.ReadConfig()
	Coms.ReadExternalConfig("db.json", &config)
	database = setupDB()
	defer database.Close()
	Coms.Println("Going up")
	http.HandleFunc("POST /userCreate", userCreateNew)
	http.HandleFunc("/user-confirmation/{token}", userConfirmation)
	http.ListenAndServe(Coms.GetLaunchPort(), nil)
}

func setupDB() *sql.DB {
	db, err := sql.Open("postgres", config.PSQLInfo())
	if err != nil {
		panic("Could not connect to DB: " + err.Error())
	}

	err = db.Ping()
	if err != nil {
		panic("Could not ping DB at " + config.PSQLInfo() + ": " + err.Error())
	}
	return db
}
