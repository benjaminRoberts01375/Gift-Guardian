package main

import (
	"net/http"

	Coms "github.com/benjaminRoberts01375/Go-Communicate"
)

func userJWTSignIn(w http.ResponseWriter, r *http.Request) {
	_, valid := userJWTIsValidFromCookie(r)
	if !valid {
		Coms.ExternalPostRespondCode(http.StatusForbidden, w)
		return
	}
	Coms.ExternalPostRespondCode(http.StatusOK, w)
}
