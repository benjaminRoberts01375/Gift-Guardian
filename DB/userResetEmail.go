package main

import (
	"net/http"

	Coms "github.com/benjaminRoberts01375/Go-Communicate"
)

func userResetEmailRequest(w http.ResponseWriter, r *http.Request) {
	claims, _, updatedEmail, err := checkUserRequest[string](r)
	if err != nil {
		Coms.ExternalPostRespondCode(http.StatusInternalServerError, w)
		return
	}
	activationToken, err := cache.setChangeEmail(claims.Username, *updatedEmail)
	if err != nil {
		Coms.ExternalPostRespondCode(http.StatusInternalServerError, w)
		return
	}
	emailMessage := `Please verify your new Gift Guardian email address by clicking the link below:
https://giftguardian.benlab.us/db/user-reset-email-confirmation/` + activationToken + `
If you did not request this change, please ignore this email.`
	sendEmail(*updatedEmail, "Gift Guardian Account Confirmation", emailMessage)
	Coms.ExternalPostRespondCode(http.StatusOK, w)
}

func userResetEmailConfirmation(w http.ResponseWriter, r *http.Request) {
	activationToken := r.PathValue("token")
	oldEmail, newEmail, err := cache.getAndDeleteChangeEmail(activationToken)
	if err != nil {
		Coms.PrintErrStr("Error during reset email confirmation 1: " + err.Error())
		Coms.ExternalPostRespondCode(http.StatusInternalServerError, w)
		return
	}
	statement := `UPDATE users SET email = $1 WHERE email = $2;`
	_, err = database.Exec(statement, newEmail, oldEmail)
	if err != nil {
		Coms.PrintErrStr("Error during reset email confirmation 2: " + err.Error())
		Coms.ExternalPostRespondCode(http.StatusInternalServerError, w)
		return
	}
	http.Redirect(w, r, "https://giftguardian.benlab.us/login", http.StatusSeeOther)
}
