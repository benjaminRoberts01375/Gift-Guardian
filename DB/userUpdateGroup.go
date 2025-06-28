package main

import (
	"net/http"

	"github.com/benjaminRoberts01375/Gift-Guardian/DB/models"
	Coms "github.com/benjaminRoberts01375/Go-Communicate"
)

func userUpdateGroup(w http.ResponseWriter, r *http.Request) {
	_, _, group, err := checkUserRequest[models.Group](r)
	if err != nil {
		Coms.ExternalPostRespondCode(http.StatusInternalServerError, w)
		return
	}

	dbTransaction, err := database.Begin()
	if err != nil {
		Coms.ExternalPostRespondCode(http.StatusInternalServerError, w)
		return
	}
	defer dbTransaction.Rollback()

	statement := `
	UPDATE groups
	SET list_id = $1, name = $2
	WHERE id = $3
	`
	_, err = dbTransaction.Exec(statement, group.ListID, group.Name, group.ID)
	if err != nil {
		Coms.ExternalPostRespondCode(http.StatusInternalServerError, w)
		return
	}
	dbTransaction.Commit()
	Coms.ExternalPostRespondCode(http.StatusOK, w)
}
