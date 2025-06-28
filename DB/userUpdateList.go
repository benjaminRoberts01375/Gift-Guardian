package main

import (
	"net/http"

	"github.com/benjaminRoberts01375/Gift-Guardian/DB/models"
	Coms "github.com/benjaminRoberts01375/Go-Communicate"
)

func userUpdateList(w http.ResponseWriter, r *http.Request) {
	_, _, list, err := checkUserRequest[models.List](r)
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
	UPDATE lists
	SET name = $1, private = $2
	WHERE id = $3
	`
	_, err = dbTransaction.Exec(statement, list.Name, list.Private, list.ID)
	if err != nil {
		Coms.ExternalPostRespondCode(http.StatusInternalServerError, w)
		return
	}
	dbTransaction.Commit()
	Coms.ExternalPostRespondCode(http.StatusOK, w)
}
