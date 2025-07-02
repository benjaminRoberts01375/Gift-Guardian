package main

import (
	"net/http"

	Coms "github.com/benjaminRoberts01375/Go-Communicate"
)

func userResetPasswordRequest(w http.ResponseWriter, r *http.Request) {
	email, err := Coms.ExternalPostReceived[string](r)
	if err != nil {
		Coms.ExternalPostRespondCode(http.StatusInternalServerError, w)
		return
	}
	transactionID, err := cacheResetPassword(*email)
	if err != nil {
		Coms.ExternalPostRespondCode(http.StatusInternalServerError, w)
		return
	}

	message := `A password reset was issued for your Gift Guardian account. To reset your password, click the link below:
https://giftguardian.benlab.us/reset-password/` + transactionID
	go sendEmail(*email, "Gift Guardian Password Reset", message)

	Coms.ExternalPostRespondCode(http.StatusOK, w)
}

func userResetPasswordCheckValid(w http.ResponseWriter, r *http.Request) {
	replaceToken := r.PathValue("token")
	email, err := getCacheEntry(replaceToken)

	if err != nil || email == "" {
		Coms.ExternalPostRespondCode(http.StatusNotFound, w)
		return
	}
	Coms.ExternalPostRespondCode(http.StatusOK, w)
}

func userResetPasswordConfirmation(w http.ResponseWriter, r *http.Request) {
	replaceToken := r.PathValue("token")
	newPassword, err := Coms.ExternalPostReceived[string](r)
	if err != nil {
		Coms.ExternalPostRespondCode(http.StatusBadRequest, w)
		return
	}
	email, err := getAndDeleteCacheEntry(replaceToken)
	if err != nil || email == "" {
		Coms.ExternalPostRespondCode(http.StatusBadRequest, w)
		return
	}
	newPasswordHash, err := createPasswordHash(*newPassword)
	if err != nil {
		Coms.ExternalPostRespondCode(http.StatusInternalServerError, w)
		return
	}
	statement := "UPDATE users SET password = $1 WHERE email = $2"
	_, err = database.Exec(statement, newPasswordHash, email)
	if err != nil {
		Coms.ExternalPostRespondCode(http.StatusInternalServerError, w)
		return
	}
	Coms.ExternalPostRespondCode(http.StatusOK, w)
}
