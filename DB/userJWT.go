package main

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
)

const UserJWTCookieName = "gg-jwt"
const UserJWTDuration = time.Hour*24*6 + time.Hour*12 // 6 + 0.5 days
const UserJWTConfirmation = time.Minute * 15

type UserJWTClaims struct {
	Username string `json:"username"`
	jwt.RegisteredClaims
}

func userGenerateJWT(username string, duration time.Duration) (string, error) {
	claims := UserJWTClaims{
		Username: username,
	}
	claims.ExpiresAt = jwt.NewNumericDate(time.Now().Add(duration))
	claims.IssuedAt = jwt.NewNumericDate(time.Now())
	claims.NotBefore = jwt.NewNumericDate(time.Now())
	claims.Issuer = "Gift Guardian DB"
	claims.Subject = "GG Login"
	return jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString([]byte(config.JWTSecret))
}

func userJWTIsValid(tokenString string) (*UserJWTClaims, bool) {
	token, err := jwt.ParseWithClaims(tokenString, &UserJWTClaims{}, func(token *jwt.Token) (any, error) {
		return []byte(config.JWTSecret), nil
	})
	if err != nil {
		return nil, false
	}
	claims, ok := token.Claims.(*UserJWTClaims)
	if !ok || !token.Valid || !userExists(claims.Username) {
		return nil, false
	}
	return claims, claims.ExpiresAt.After(time.Now())
}

func userExists(username string) bool {
	statement := `SELECT EXISTS(SELECT 1 FROM users WHERE email = $1);`
	var dbExists bool
	err := database.QueryRow(statement, username).Scan(&dbExists)
	return err == nil && dbExists
}
