package config

import (
	"errors"
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
	"github.com/sirupsen/logrus"
)

var (
	EnvDevelopment = "development"
)

type Env struct {
	Port        int    `env:"PORT"`
	Environment string `env:"GO_ENV"`
	Version     string
	LogLevel    logrus.Level `env:"LOG_LEVEL"`
}

var requiredEnvVars = []string{
	"PORT",
	"GO_ENV",
}

func GetConfig() (*Env, error) {
	if fileExists(".env") {
		log.Println("Loading ENV vars from file")
		err := godotenv.Load()
		if err != nil {
			return nil, err
		}
	} else {
		log.Println("Loading ENV vars from env")
	}

	// Ensure all env vars are available
	for _, envVar := range requiredEnvVars {
		_, exists := os.LookupEnv(envVar)
		if !exists {
			return nil, errors.New("EnvVar is missing: " + envVar)
		}
	}

	var err error
	appPort, err := strconv.Atoi(os.Getenv("PORT"))
	logLevel, err := logrus.ParseLevel(os.Getenv("LOG_LEVEL"))
	if err != nil {
		return nil, err
	}
	return &Env{
		Port:        appPort,
		Environment: os.Getenv("GO_ENV"),
		LogLevel:    logLevel,
	}, err
}

func fileExists(filename string) bool {
	info, err := os.Stat(filename)
	if os.IsNotExist(err) {
		return false
	}
	return !info.IsDir()
}
