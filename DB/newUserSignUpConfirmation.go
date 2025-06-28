package main

import (
	"net/http"

	Coms "github.com/benjaminRoberts01375/Go-Communicate"
)

func newUserSignUpConfirmation(w http.ResponseWriter, r *http.Request) {
	activationToken := r.PathValue("token")
	claims, valid := userJWTIsValid(activationToken)
	if !valid {
		Coms.ExternalPostRespondCode(http.StatusForbidden, w)
		return
	}
	http.Redirect(w, r, "https://giftguardian.benlab.us/login", http.StatusSeeOther)
	statement := `UPDATE users SET confirmed = TRUE WHERE email = $1;`
	database.Exec(statement, claims.Username)
}
