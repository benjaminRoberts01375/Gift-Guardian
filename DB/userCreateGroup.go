package main

import (
	"database/sql"
	"net/http"

	"github.com/benjaminRoberts01375/Gift-Guardian/DB/models"
	Coms "github.com/benjaminRoberts01375/Go-Communicate"
)

func userCreateGroup(w http.ResponseWriter, r *http.Request) {
	_, _, requestGroup, err := checkUserRequest[models.Group](r)
	if err != nil {
		Coms.ExternalPostRespondCode(http.StatusInternalServerError, w)
		return
	}

	statement := `
WITH new_group AS (
    INSERT INTO groups (list_id, name)
    VALUES ($1, $2)
    RETURNING id
),
new_gift AS (
    INSERT INTO gifts (group_id, name, description, location)
    VALUES ((SELECT id FROM new_group), $3, $4, $5)
    RETURNING id
)
SELECT
    (SELECT id FROM new_group) as group_id,
    (SELECT id FROM new_gift) as gift_id;
	`
	err = database.QueryRow(statement, requestGroup.ListID, requestGroup.Name,
		requestGroup.Gifts[0].Name, requestGroup.Gifts[0].Description,
		requestGroup.Gifts[0].Location,
	).Scan(
		&requestGroup.ID, &requestGroup.Gifts[0].ID,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			Coms.ExternalPostRespondCode(http.StatusNotFound, w)
			return
		}
		Coms.ExternalPostRespondCode(http.StatusInternalServerError, w)
		return
	}
	Coms.ExternalPostRespond(requestGroup, w)
}
