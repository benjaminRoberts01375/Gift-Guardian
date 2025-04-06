package main

import (
	"encoding/json"
	"os"
	"path/filepath"

	Coms "github.com/benjaminRoberts01375/Go-Communicate"
	ComsModels "github.com/benjaminRoberts01375/Go-Communicate/models"
)

const LaunchPort = 9001

func main() {
	setupDBAPI()
}

func setupDBAPI() Coms.Config {
	executable, err := os.Executable()
	if err != nil {
		panic(err)
	}
	repoPath := filepath.Dir(filepath.Dir(executable))
	DBAPIEnvPath := filepath.Join(repoPath, "DB", ".env")
	DBAPIComsConfig := Coms.Config{
		System: ComsModels.SystemInfo{
			Role:  "DB",
			Color: 5,
		},
		EncryptionKeys: Coms.CreateEncryptionKeys(),
		LaunchPort:     LaunchPort,
	}
	DBAPIComsConfigBytes, err := json.Marshal(DBAPIComsConfig)
	if err != nil {
		panic(err)
	}
	err = os.WriteFile(filepath.Join(DBAPIEnvPath, "coms.json"), DBAPIComsConfigBytes, 0644)
	if err != nil {
		panic(err)
	}
	return DBAPIComsConfig
}
