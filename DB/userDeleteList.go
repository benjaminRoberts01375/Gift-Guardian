package main

import (
	"net/http"

	Coms "github.com/benjaminRoberts01375/Go-Communicate"
)

func userDeleteList(w http.ResponseWriter, r *http.Request) {
	_, _, listID, err := checkUserRequest[string](r)
	if err != nil {
		Coms.ExternalPostRespondCode(http.StatusInternalServerError, w)
		return
	}
	statement := `
DELETE FROM lists
WHERE id = $1
	`
	_, err = database.Exec(statement, listID)
	if err != nil {
		Coms.ExternalPostRespondCode(http.StatusInternalServerError, w)
		return
	}
	Coms.ExternalPostRespondCode(http.StatusOK, w)
}
