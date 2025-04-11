package models

import (
	"fmt"

	Coms "github.com/benjaminRoberts01375/Go-Communicate"
)

type Config struct {
	DBPort             int    `json:"db_port"`
	DBName             string `json:"db_name"`
	DBUser             string `json:"user"`
	DBPassword         string `json:"password"`
	DBContainerName    string `json:"container_name"`
	JWTSecret          string `json:"jwt_secret"`
	EmailAPIKey        string `json:"email_api_key"`
	AllowSendingEmails bool   `json:"allow_sending_emails"`
}

// Returns the URL to connect to the DB
func (config Config) PSQLInfo() string {
	return fmt.Sprintf(
		"postgresql://%s:%s@%s:%d/%s?sslmode=disable",
		config.DBUser, config.DBPassword, config.DBContainerName, config.DBPort, config.DBName,
	)
}

// Checks that config is set up correctly, panics if not
func (config Config) PreflightChecks() {
	if config.DBPort == 0 {
		panic("DBPort is not set in config")
	}
	if config.DBName == "" {
		panic("DBName is not set in config")
	}
	if config.DBUser == "" {
		panic("DBUser is not set in config")
	}
	if config.DBPassword == "" {
		panic("DBPassword is not set in config")
	}
	if config.DBContainerName == "" {
		panic("DBContainerName is not set in config")
	}
	if config.JWTSecret == "" {
		panic("JWTSecret is not set in config")
	}
	if config.EmailAPIKey == "" {
		panic("EmailAPIKey is not set in config")
	}
	Coms.Println("Preflight checks passed")
}
