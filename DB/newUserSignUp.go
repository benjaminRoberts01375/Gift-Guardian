package main

import (
	"net/http"

	"github.com/benjaminRoberts01375/Gift-Guardian/DB/models"
	Coms "github.com/benjaminRoberts01375/Go-Communicate"
	"golang.org/x/crypto/bcrypt"
)

func newUserSignUp(w http.ResponseWriter, r *http.Request) {
	userData, err := Coms.ExternalPostReceived[models.UserCreateNew](r)
	if err != nil {
		Coms.ExternalPostRespondCode(http.StatusBadRequest, w)
		return
	}
	userPassword, err := createPasswordHash(userData.Password)
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

	confirmationJWT, err := userGenerateJWT(userData.Email, UserJWTConfirmation)
	if err != nil {
		return
	}
	message := `Hello ` + userData.FirstName + `, and welcome to Gift Guardian! Please click the link below to confirm your account:
https://giftguardian.benlab.us/db/user-confirmation/` + confirmationJWT
	go sendEmail(userData.Email, "Gift Guardian Account Confirmation", message)
}

func createPasswordHash(password string) ([]byte, error) {
	return bcrypt.GenerateFromPassword([]byte(password), 10) // 72 bytes max
}
