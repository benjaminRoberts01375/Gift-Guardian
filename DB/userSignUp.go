package main

import (
	"net/http"

	Coms "github.com/benjaminRoberts01375/Go-Communicate"
	"github.com/resend/resend-go/v2"
	"golang.org/x/crypto/bcrypt"
)

type UserCreateNew struct {
	Email     string `json:"username"`
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
	if config.AllowSendingEmails {
		go sendConfirmationEmail(userData.Email, userData.FirstName)
	}
}

func sendConfirmationEmail(username string, firstName string) {
	confirmationJWT, err := userGenerateJWT(username, UserJWTConfirmation)
	if err != nil {
		Coms.Println(err)
		return
	}
	message := `Hello ` + firstName + `, and welcome to Gift Guardian! Please click the link below to confirm your account:
https://giftguardian.benlab.us/user-confirmation/` + confirmationJWT
	client := resend.NewClient(config.EmailAPIKey)
	emailParams := &resend.SendEmailRequest{
		From:    "No Reply <do-not-reply@mail.benlab.us>",
		To:      []string{username},
		Subject: "Gift Guardian Account Confirmation",
		Text:    message,
	}
	_, err = client.Emails.Send(emailParams)
	if err != nil {
		Coms.Println(err)
	}
}
