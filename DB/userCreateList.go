package main

import (
	"net/http"

	"github.com/benjaminRoberts01375/Gift-Guardian/DB/models"
	Coms "github.com/benjaminRoberts01375/Go-Communicate"
)

func userCreateList(w http.ResponseWriter, r *http.Request) {
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

	list, err := Coms.ExternalPostReceived[models.List](r)
	if err != nil {
		Coms.ExternalPostRespondCode(http.StatusInternalServerError, w)
		return
	}

	statement := `INSERT INTO lists (owner_id, name) VALUES ($1, $2) RETURNING id`
	listID := ""
	err = database.QueryRow(statement, userID, list.Name).Scan(&listID)
	if err != nil {
		Coms.ExternalPostRespondCode(http.StatusInternalServerError, w)
		return
	}
	Coms.ExternalPostRespond(listID, w)
}
