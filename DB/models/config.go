package models

import (
	"fmt"
)

type Config struct {
	DBPort        int    `json:"db_port"`
	DBName        string `json:"db_name"`
	User          string `json:"user"`
	Password      string `json:"password"`
	ContainerName string `json:"container_name"`
}

func (config Config) PSQLInfo() string {
	return fmt.Sprintf(
		"postgresql://%s:%s@%s:%d/%s?sslmode=disable",
		config.User, config.Password, config.ContainerName, config.DBPort, config.DBName,
	)
}
