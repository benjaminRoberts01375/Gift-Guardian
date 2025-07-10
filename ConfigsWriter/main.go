package main

import (
	"encoding/json"
	"math/rand"
	"os"
	"path/filepath"

	DBModels "github.com/benjaminRoberts01375/Gift-Guardian/DB/models"
	Coms "github.com/benjaminRoberts01375/Go-Communicate"
)

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
		EncryptionKeys: Coms.CreateEncryptionKeys(),
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
	dbConfig.JWTSecret = generateRandomString(32)

	return DBAPIComsConfig, dbConfig
}

func generateRandomString(length int) string {
	// Charset is URL safe and easy to read
	const charset = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ123456789"

	stringBase := make([]byte, length)
	for i := range stringBase {
		stringBase[i] = charset[rand.Intn(len(charset))]
	}
	return string(stringBase)
}
