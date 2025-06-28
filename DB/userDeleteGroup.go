package main

import (
	"net/http"

	Coms "github.com/benjaminRoberts01375/Go-Communicate"
)

func userDeleteGroup(w http.ResponseWriter, r *http.Request) {
	_, _, groupID, err := checkUserRequest[string](r)
	if err != nil {
		Coms.ExternalPostRespondCode(http.StatusInternalServerError, w)
		return
	}
	statement := `
DELETE FROM groups
WHERE id = $1
	`
	_, err = database.Exec(statement, groupID)
	if err != nil {
		Coms.ExternalPostRespondCode(http.StatusInternalServerError, w)
		return
	}
	Coms.ExternalPostRespondCode(http.StatusOK, w)
}
