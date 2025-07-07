package main

import (
	"net/http"

	Coms "github.com/benjaminRoberts01375/Go-Communicate"
)

func userJWTSignIn(w http.ResponseWriter, r *http.Request) {
	_, userID, _, err := checkUserRequest[any](r)
	if err != nil {
		Coms.ExternalPostRespondCode(http.StatusInternalServerError, w)
		return
	}
	err = userHasLoggedIn(userID)
	if err != nil {
		Coms.ExternalPostRespondCode(http.StatusInternalServerError, w)
		return
	}
	Coms.ExternalPostRespondCode(http.StatusOK, w)
}
