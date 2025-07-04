package main

import (
	"errors"
	"net/http"
	"reflect"

	Coms "github.com/benjaminRoberts01375/Go-Communicate"
)

func checkUserRequest[ReturnType any](r *http.Request) (*UserJWTClaims, string, *ReturnType, error) {
	claims, isValid := userJWTIsValidFromCookie(r)
	if !isValid {
		return nil, "", nil, errors.New("invalid JWT")
	}
	// Get user ID from email
	var userID string
	err := database.QueryRow("SELECT id FROM users WHERE email=$1", claims.Username).Scan(&userID)
	if err != nil {
		return nil, "", nil, err
	}

	// Check if ReturnType is any/interface{}
	var zero ReturnType
	if reflect.TypeOf((*ReturnType)(nil)).Elem() == reflect.TypeOf((*any)(nil)).Elem() {
		return claims, userID, &zero, nil
	}

	requestGroup, err := Coms.ExternalPostReceived[ReturnType](r)
	return claims, userID, requestGroup, err
}
