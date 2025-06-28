package main

import (
	"net/http"

	Coms "github.com/benjaminRoberts01375/Go-Communicate"
)

func userDeleteGift(w http.ResponseWriter, r *http.Request) {
	_, _, giftID, err := checkUserRequest[string](r)
	if err != nil {
		Coms.ExternalPostRespondCode(http.StatusInternalServerError, w)
		return
	}
	statement := `
DELETE FROM gifts
WHERE id = $1
	`
	_, err = database.Exec(statement, giftID)
	if err != nil {
		Coms.ExternalPostRespondCode(http.StatusInternalServerError, w)
		return
	}
	Coms.ExternalPostRespondCode(http.StatusOK, w)
}
