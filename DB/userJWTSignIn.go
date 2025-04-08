package main

import (
	"net/http"

	Coms "github.com/benjaminRoberts01375/Go-Communicate"
)

func userJWTSignIn(w http.ResponseWriter, r *http.Request) {
	requestJWT, err := r.Cookie(UserJWTCookieName)
	if err != nil {
		Coms.ExternalPostRespondCode(http.StatusBadRequest, w)
		return
	}
	_, valid := userJWTIsValid(requestJWT.Value)
	if !valid {
		Coms.ExternalPostRespondCode(http.StatusForbidden, w)
		return
	}
	Coms.ExternalPostRespondCode(http.StatusOK, w)
}
