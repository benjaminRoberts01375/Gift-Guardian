package main

import (
	"database/sql"
	"net/http"

	"github.com/benjaminRoberts01375/Gift-Guardian/DB/models"
	Coms "github.com/benjaminRoberts01375/Go-Communicate"
)

func userCreateList(w http.ResponseWriter, r *http.Request) {
	_, userID, requestList, err := checkUserRequest[models.List](r)
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
    RETURNING id, list_id
),
new_gift AS (
    INSERT INTO gifts (group_id, name, description, location)
    VALUES ((SELECT id FROM new_group), $4, $5, $6)
    RETURNING id, group_id
)
SELECT
    (SELECT id FROM new_list),
    (SELECT id FROM new_group),
		(SELECT list_id FROM new_group),
    (SELECT id FROM new_gift),
		(SELECT group_id FROM new_gift);
	`
	err = database.QueryRow(statement,
		userID, requestList.Name,
		requestList.Groups[0].Name, requestList.Groups[0].Gifts[0].Name,
		requestList.Groups[0].Gifts[0].Description, requestList.Groups[0].Gifts[0].Location,
	).Scan(
		&requestList.ID,
		&requestList.Groups[0].ID, &requestList.Groups[0].ListID,
		&requestList.Groups[0].Gifts[0].ID, &requestList.Groups[0].Gifts[0].GroupID,
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
