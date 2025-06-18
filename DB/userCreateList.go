package main

import (
	"database/sql"
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
	requestList, err := Coms.ExternalPostReceived[models.List](r)
	if err != nil {
		Coms.ExternalPostRespondCode(http.StatusInternalServerError, w)
		return
	}

	statement := `
WITH new_list AS (
    INSERT INTO lists (owner_id, name)
    VALUES ($1, $2)
    RETURNING id
),
new_group AS (
    INSERT INTO groups (list_id, name)
    VALUES ((SELECT id FROM new_list), $3)
    RETURNING id
),
new_gift AS (
    INSERT INTO gifts (group_id, name, description)
    VALUES ((SELECT id FROM new_group), $4, $5)
    RETURNING id
)
SELECT
    (SELECT id FROM new_list) as list_id,
    (SELECT id FROM new_group) as group_id,
    (SELECT id FROM new_gift) as gift_id;
	`
	err = database.QueryRow(statement, userID, requestList.Name,
		requestList.Groups[0].Name, requestList.Groups[0].Gifts[0].Name,
		requestList.Groups[0].Gifts[0].Description).Scan(
		&requestList.ID, &requestList.Groups[0].ID,
		&requestList.Groups[0].Gifts[0].ID,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			Coms.ExternalPostRespondCode(http.StatusNotFound, w)
			return
		}
		Coms.ExternalPostRespondCode(http.StatusInternalServerError, w)
		return
	}
	Coms.ExternalPostRespond(requestList, w)
}
