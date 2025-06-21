package main

import (
	"net/http"

	Coms "github.com/benjaminRoberts01375/Go-Communicate"
)

func userDeleteGroup(w http.ResponseWriter, r *http.Request) {
	claims, isValid := userJWTIsValidFromCookie(r)
	if !isValid {
		Coms.ExternalPostRespondCode(http.StatusForbidden, w)
		return
	}
	// Get user ID from email
	var userID string
	err := database.QueryRow("SELECT id FROM users WHERE email=$1", claims.Username).Scan(&userID)
	if err != nil {
		Coms.ExternalPostRespondCode(http.StatusInternalServerError, w)
		return
	}
	groupID, err := Coms.ExternalPostReceived[string](r)
	if err != nil {
		Coms.ExternalPostRespondCode(http.StatusInternalServerError, w)
		return
	}
	statement := `
DELETE FROM groups
WHERE id = $1
	`
	_, err = database.Exec(statement, groupID)
	if err != nil {
		Coms.ExternalPostRespondCode(http.StatusInternalServerError, w)
		return
	}
	Coms.ExternalPostRespondCode(http.StatusOK, w)
}
