package main

import (
	"net/http"
	"time"

	Coms "github.com/benjaminRoberts01375/Go-Communicate"
	"golang.org/x/crypto/bcrypt"
)

type UserSignIn struct {
	Email    string `json:"username"`
	Password string `json:"password"`
}

func userSignIn(w http.ResponseWriter, r *http.Request) {
	Coms.Println("Attempting to sign in")
	userRequest, err := Coms.ExternalPostReceived[UserSignIn](r)
	if err != nil {
		Coms.ExternalPostRespondCode(http.StatusBadRequest, w)
		return
	}
	statement := `
	SELECT password
	FROM users
	WHERE email = $1 AND confirmed = true
	`
	var dbPasswordHash []byte
	err = database.QueryRow(statement, userRequest.Email).Scan(&dbPasswordHash)
	if err != nil {
		Coms.ExternalPostRespondCode(http.StatusBadRequest, w)
		return
	}
	// Compare the password with the hash
	if err := bcrypt.CompareHashAndPassword(dbPasswordHash, []byte(userRequest.Password)); err != nil {
		Coms.ExternalPostRespondCode(http.StatusBadRequest, w) // Intentionally obscure the error to prevent username guessing
		return
	}

	// If the password is correct, generate a JWT
	jwt, err := userGenerateJWT(userRequest.Email, UserJWTDuration)
	if err != nil {
		Coms.ExternalPostRespondCode(http.StatusInternalServerError, w)
		return
	}
	http.SetCookie(w, &http.Cookie{
		Name:     UserJWTCookieName,
		Value:    jwt,
		HttpOnly: false,
		Secure:   true,
		SameSite: http.SameSiteStrictMode,
		Expires:  time.Now().Add(UserJWTDuration),
		Path:     "/",
	})
	Coms.ExternalPostRespondCode(http.StatusOK, w)
	Coms.Println("Successfully signed in")
}
