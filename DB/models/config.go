package models

import (
	"fmt"

	ComModels "github.com/benjaminRoberts01375/Go-Communicate/models"
)

type Config struct {
	Address       ComModels.Address `json:"db_address"`
	DBName        string            `json:"db_name"`
	User          string            `json:"user"`
	Password      string            `json:"password"`
	ContainerName string            `json:"container_name"`
}

func (config Config) PSQLInfo() string {
	return fmt.Sprintf(
		"postgresql://%s:%s@%s:%d/%s?sslmode=disable",
		config.User, config.Password, config.ContainerName, config.Address.Port, config.DBName,
	)
}
