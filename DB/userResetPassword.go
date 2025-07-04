package main

import (
	"net/http"

	Coms "github.com/benjaminRoberts01375/Go-Communicate"
)

func userResetPassword(w http.ResponseWriter, r *http.Request) {
	_, userID, password, err := checkUserRequest[string](r)
	if err != nil {
		Coms.ExternalPostRespondCode(http.StatusInternalServerError, w)
		return
	}
	newPasswordHash, err := createPasswordHash(*password)
	if err != nil {
		Coms.ExternalPostRespondCode(http.StatusInternalServerError, w)
		return
	}
	statement := "UPDATE users SET password = $1 WHERE id = $2"
	_, err = database.Exec(statement, newPasswordHash, userID)
	if err != nil {
		Coms.ExternalPostRespondCode(http.StatusForbidden, w)
		return
	}
	Coms.ExternalPostRespondCode(http.StatusOK, w)
}
