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
	preflightChecks()
	database = setupDB()
	defer database.Close()
	Coms.Println("Going up")
	http.HandleFunc("POST /userCreate", userCreateNew)
	http.HandleFunc("POST /userSignIn", userSignIn)
	http.HandleFunc("POST /userJWTSignIn", userJWTSignIn)
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

func preflightChecks() {
	if config.DBPort == 0 {
		panic("DBPort is not set in config")
	}
	if config.DBName == "" {
		panic("DBName is not set in config")
	}
	if config.DBUser == "" {
		panic("DBUser is not set in config")
	}
	if config.DBPassword == "" {
		panic("DBPassword is not set in config")
	}
	if config.DBContainerName == "" {
		panic("DBContainerName is not set in config")
	}
	if config.JWTSecret == "" {
		panic("JWTSecret is not set in config")
	}
	if config.EmailAPIKey == "" {
		panic("EmailAPIKey is not set in config")
	}
	Coms.Println("Preflight checks passed")
}
