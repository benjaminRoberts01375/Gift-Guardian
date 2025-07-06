package main

import (
	"database/sql"
	"net/http"

	_ "github.com/lib/pq"

	"github.com/benjaminRoberts01375/Gift-Guardian/DB/models"
	Coms "github.com/benjaminRoberts01375/Go-Communicate"
)

var database *sql.DB
var cache CacheClient[*CacheLayer]
var config models.Config

func main() {
	Coms.ReadConfig()
	Coms.ReadExternalConfig("db.json", &config)
	config.PreflightChecks()
	database = setupDB()
	defer database.Close()
	// Setup cache
	cache.raw = &CacheLayer{}
	cache.raw.Setup()
	defer cache.raw.Close()

	Coms.Println("Going up")
	http.HandleFunc("POST /userCreate", newUserSignUp)
	http.HandleFunc("POST /userSignIn", newUserSignIn)
	http.HandleFunc("POST /userJWTSignIn", userJWTSignIn)
	http.HandleFunc("/user-confirmation/{token}", newUserSignUpConfirmation)
	http.HandleFunc("POST /userCreateList", userCreateList)
	http.HandleFunc("POST /userUpdateList", userUpdateList)
	http.HandleFunc("POST /userGetData", userGetData)
	http.HandleFunc("POST /userCreateGroup", userCreateGroup)
	http.HandleFunc("POST /userUpdateGift", userUpdateGift)
	http.HandleFunc("POST /userCreateGift", userCreateGift)
	http.HandleFunc("POST /userUpdateGroup", userUpdateGroup)
	http.HandleFunc("POST /userDeleteGroup", userDeleteGroup)
	http.HandleFunc("POST /userDeleteList", userDeleteList)
	http.HandleFunc("POST /userDeleteGift", userDeleteGift)
	http.HandleFunc("POST /user-forgot-password-request", userForgotPasswordRequest)
	http.HandleFunc("POST /user-forgot-password-check/{token}", userForgotPasswordCheckValid)
	http.HandleFunc("POST /user-forgot-password-confirmation/{token}", userForgotPasswordConfirmation)
	http.HandleFunc("POST /user-reset-password", userResetPassword)
	http.HandleFunc("POST /user-reset-email-request", userResetEmailRequest)
	http.HandleFunc("/user-reset-email-confirmation/{token}", userResetEmailConfirmation)
	if config.DevMode {
		Coms.Println("Dev mode enabled")
	}
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
