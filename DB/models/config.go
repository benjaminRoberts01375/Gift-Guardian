package models

import (
	"encoding/json"
	"fmt"
	"os"
	"strconv"

	Coms "github.com/benjaminRoberts01375/Go-Communicate"
)

type Config struct {
	DBPort          int    `json:"db_port"`
	DBName          string `json:"db_name"`
	DBUser          string `json:"db_user"`
	DBPassword      string `json:"db_password"`
	DBContainerName string `json:"db_container_name"`

	CachePort          int    `json:"cache_port"`
	CacheContainerName string `json:"cache_container_name"`
	CachePassword      string `json:"cache_password"`
	CacheIDLength      int    `json:"cache_id_length"`

	JWTSecret          string `json:"jwt_secret"`
	EmailAPIKey        string `json:"email_api_key"`
	AllowSendingEmails bool   `json:"allow_sending_emails"`
	DevMode            bool   `json:"dev_mode"`
}

// DEBUG PURPOSES ONLY - CONTAINS SENSITIVE INFORMATION
func (config *Config) String() string {
	jsonBytes, err := json.MarshalIndent(config, "", "  ")
	if err != nil {
		return config.DBName
	}
	return string(jsonBytes)
}

func (config *Config) ReadConfig() {
	DBPort, err := strconv.Atoi(os.Getenv("DB_PORT"))
	if err != nil {
		panic("Could not read DB_PORT from environment: " + err.Error())
	} else if DBPort <= 0 {
		panic("DB_PORT is not set in environment")
	}
	DBContainerName := os.Getenv("DB_CONTAINER_NAME")
	if DBContainerName == "" {
		panic("DB_CONTAINER_NAME is not set in environment")
	}
	cachePort, err := strconv.Atoi(os.Getenv("CACHE_PORT"))
	if err != nil || cachePort <= 0 {
		panic("CACHE_PORT is not set in environment")
	}
	cacheContainerName := os.Getenv("CACHE_CONTAINER_NAME")
	if cacheContainerName == "" {
		panic("CACHE_CONTAINER_NAME is not set in environment")
	}
	cacheIDLength, err := strconv.Atoi(os.Getenv("CACHE_ID_LENGTH"))
	if err != nil || cacheIDLength <= 0 {
		panic("CACHE_ID_LENGTH is not set in environment")
	}
	allowSendingEmails, err := strconv.ParseBool(os.Getenv("ALLOW_SENDING_EMAILS"))
	if err != nil {
		panic("ALLOW_SENDING_EMAILS is not set in environment")
	}
	devMode, err := strconv.ParseBool(os.Getenv("DEV_MODE"))
	if err != nil {
		panic("DEV_MODE is not set in environment")
	}
	Coms.ReadExternalConfig("db.json", config)
	config.DBPort = DBPort
	config.CachePort = cachePort
	config.CacheContainerName = cacheContainerName
	config.CacheIDLength = cacheIDLength
	config.AllowSendingEmails = allowSendingEmails
	config.DevMode = devMode
	config.DBContainerName = DBContainerName
}

// Returns the URL to connect to the DB
func (config Config) PSQLInfo() string {
	return fmt.Sprintf(
		"postgresql://%s:%s@%s:%d/%s?sslmode=disable",
		config.DBUser, config.DBPassword, config.DBContainerName, config.DBPort, config.DBName,
	)
}

// Returns the URL to connect to the Valkey cache
func (config Config) ValkeyAddress() string {
	return fmt.Sprintf("%s:%d", config.CacheContainerName, config.CachePort)
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
	if config.CachePort == 0 {
		panic("CachePort is not set in config")
	}
	if config.CacheContainerName == "" {
		panic("CacheContainerName is not set in config")
	}
	if config.CachePassword == "" {
		panic("CachePassword is not set in config")
	}
	if config.CacheIDLength <= 0 {
		panic("CacheIDLength is not set in config:")
	}
	Coms.Println("Preflight checks passed")
}
