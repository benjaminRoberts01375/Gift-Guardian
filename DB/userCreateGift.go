package main

import (
	"database/sql"
	"net/http"

	"github.com/benjaminRoberts01375/Gift-Guardian/DB/models"
	Coms "github.com/benjaminRoberts01375/Go-Communicate"
)

func userCreateGift(w http.ResponseWriter, r *http.Request) {
	_, _, requestGift, err := checkUserRequest[models.Gift](r)
	if err != nil {
		Coms.ExternalPostRespondCode(http.StatusInternalServerError, w)
		return
	}

	statement := `
WITH new_gift AS (
    INSERT INTO gifts (group_id, name, description)
    VALUES ($1, $2, $3)
    RETURNING id
)
SELECT
    (SELECT id FROM new_gift) as gift_id;
	`
	err = database.QueryRow(statement, requestGift.GroupID, requestGift.Name, requestGift.Description).Scan(
		&requestGift.ID,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			Coms.ExternalPostRespondCode(http.StatusNotFound, w)
			return
		}
		Coms.ExternalPostRespondCode(http.StatusInternalServerError, w)
		return
	}
	Coms.ExternalPostRespond(requestGift, w)
}
