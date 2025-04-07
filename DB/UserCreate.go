package main

import (
	"net/http"

	Coms "github.com/benjaminRoberts01375/Go-Communicate"
	"golang.org/x/crypto/bcrypt"
)

type UserCreateNew struct {
	Email     string `json:"email"`
	Password  string `json:"password"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
}

func userCreateNew(w http.ResponseWriter, r *http.Request) {
	userData, err := Coms.ExternalPostReceived[UserCreateNew](r)
	if err != nil {
		Coms.ExternalPostRespondCode(http.StatusBadRequest, w)
		return
	}
	userPassword, err := bcrypt.GenerateFromPassword([]byte(userData.Password), 10) // 72 bytes max
	if err != nil {
		Coms.ExternalPostRespondCode(http.StatusBadRequest, w)
		return
	}
	statement := `
	INSERT INTO users (email, password, first_name, last_name)
	VALUES ($1, $2, $3, $4)
	`
	_, err = database.Exec(statement, userData.Email, string(userPassword), userData.FirstName, userData.LastName)
	if err != nil {
		Coms.ExternalPostRespondCode(http.StatusInternalServerError, w)
		return
	}
	Coms.ExternalPostRespondCode(http.StatusOK, w)
}
