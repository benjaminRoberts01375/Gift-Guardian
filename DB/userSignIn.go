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

func newUserSignIn(w http.ResponseWriter, r *http.Request) {
	userRequest, err := Coms.ExternalPostReceived[UserSignIn](r)
	if err != nil {
		Coms.ExternalPostRespondCode(http.StatusBadRequest, w)
		return
	}
	statement := `
	SELECT password, id
	FROM users
	WHERE email = $1 AND confirmed = true
	`
	var dbPasswordHash []byte
	var userID string
	err = database.QueryRow(statement, userRequest.Email).Scan(&dbPasswordHash, &userID)
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
	userHasLoggedIn(userID)
	cache.setUserSignIn(jwt, userID)

	if config.DevMode {
		http.SetCookie(w, &http.Cookie{
			Name:     UserJWTCookieName,
			Value:    jwt,
			HttpOnly: false,
			Secure:   false,
			SameSite: http.SameSiteStrictMode,
			Expires:  time.Now().Add(time.Hour * 24 * 30), // One month
			Path:     "/",
		})
	} else {
		http.SetCookie(w, &http.Cookie{
			Name:     UserJWTCookieName,
			Value:    jwt,
			HttpOnly: false,
			Secure:   true,
			SameSite: http.SameSiteStrictMode,
			Expires:  time.Now().Add(UserJWTDuration),
			Path:     "/",
		})
	}
	Coms.ExternalPostRespondCode(http.StatusOK, w)
}

func userHasLoggedIn(userID string) error {
	statement := `
	UPDATE users
	SET last_login = NOW()
	WHERE ID = $1
	`
	_, err := database.Exec(statement, userID)
	return err
}
