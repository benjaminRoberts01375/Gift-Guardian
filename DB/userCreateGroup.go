package main

import (
	"database/sql"
	"net/http"

	"github.com/benjaminRoberts01375/Gift-Guardian/DB/models"
	Coms "github.com/benjaminRoberts01375/Go-Communicate"
)

func userCreateGroup(w http.ResponseWriter, r *http.Request) {
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
	requestGroup, err := Coms.ExternalPostReceived[models.Group](r)
	if err != nil {
		Coms.ExternalPostRespondCode(http.StatusInternalServerError, w)
		return
	}
	Coms.Println("Group: ", requestGroup)
	Coms.Println("List ID: ", requestGroup.ListID)
	Coms.Println("ID: ", requestGroup.ID)

	statement := `
WITH new_group AS (
    INSERT INTO groups (list_id, name)
    VALUES ($1, $2)
    RETURNING id
),
new_gift AS (
    INSERT INTO gifts (group_id, name, description)
    VALUES ((SELECT id FROM new_group), $3, $4)
    RETURNING id
)
SELECT
    (SELECT id FROM new_group) as group_id,
    (SELECT id FROM new_gift) as gift_id;
	`
	err = database.QueryRow(statement, requestGroup.ListID, requestGroup.Name,
		requestGroup.Gifts[0].Name, requestGroup.Gifts[0].Description,
	).Scan(
		&requestGroup.ID, &requestGroup.Gifts[0].ID,
	)
	if err != nil {
		Coms.PrintErr(err)
		if err == sql.ErrNoRows {
			Coms.ExternalPostRespondCode(http.StatusNotFound, w)
			return
		}
		Coms.ExternalPostRespondCode(http.StatusInternalServerError, w)
		return
	}
	Coms.ExternalPostRespond(requestGroup, w)
}

// WITH new_group AS (
//     INSERT INTO groups (list_id, name)
//     VALUES ('458af1c2-aafb-4992-9ef8-066226f4e82b', 'test group')
//     RETURNING id
// ),
// new_gift AS (
//     INSERT INTO gifts (group_id, name, description)
//     VALUES ((SELECT id FROM new_group), 'test gift', 'nerd')
//     RETURNING id
// )
// SELECT
//     (SELECT id FROM new_group) as group_id,
//     (SELECT id FROM new_gift) as gift_id;
