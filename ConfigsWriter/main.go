package main

import (
	"encoding/json"
	"os"
	"path/filepath"

	DBModels "github.com/benjaminRoberts01375/Gift-Guardian/DB/models"
	Coms "github.com/benjaminRoberts01375/Go-Communicate"
	ComsModels "github.com/benjaminRoberts01375/Go-Communicate/models"
)

const LaunchPort = 9001

func main() {
	setupDB()
}

func setupDB() (Coms.Config, DBModels.Config) {
	executable, err := os.Executable()
	if err != nil {
		panic(err)
	}
	repoPath := filepath.Dir(filepath.Dir(executable))
	DBAPIEnvPath := filepath.Join(repoPath, "DB", ".env")
	os.MkdirAll(DBAPIEnvPath, 0755)
	DBAPIComsConfig := Coms.Config{
		System: ComsModels.SystemInfo{
			Role:  "DB",
			Color: 5,
		},
		EncryptionKeys: Coms.CreateEncryptionKeys(),
		LaunchPort:     LaunchPort,
	}

	DBConfigBytes, err := json.Marshal(dbConfig)
	if err != nil {
		panic(err)
	}
	err = os.WriteFile(filepath.Join(DBAPIEnvPath, "db.json"), DBConfigBytes, 0644)
	if err != nil {
		panic(err)
	}

	DBComsConfigBytes, err := json.Marshal(DBAPIComsConfig)
	if err != nil {
		panic(err)
	}
	err = os.WriteFile(filepath.Join(DBAPIEnvPath, "coms.json"), DBComsConfigBytes, 0644)
	if err != nil {
		panic(err)
	}
	return DBAPIComsConfig, dbConfig
}
