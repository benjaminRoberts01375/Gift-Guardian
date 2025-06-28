package main

import (
	"net/http"

	"github.com/benjaminRoberts01375/Gift-Guardian/DB/models"
	Coms "github.com/benjaminRoberts01375/Go-Communicate"
)

func userUpdateGift(w http.ResponseWriter, r *http.Request) {
	_, _, gift, err := checkUserRequest[models.Gift](r)
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
	UPDATE gifts
	SET name = $1, description = $2, gotten = $3, location = $4
	WHERE group_id = $5 AND id = $6
	`
	_, err = dbTransaction.Exec(statement,
		gift.Name, gift.Description, gift.Gotten, gift.Location, gift.GroupID, gift.ID)
	if err != nil {
		Coms.ExternalPostRespondCode(http.StatusInternalServerError, w)
		return
	}
	dbTransaction.Commit()
	Coms.ExternalPostRespondCode(http.StatusOK, w)
}
