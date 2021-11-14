package config

import (
	"errors"
	"log"
	"os"
	"strconv"
	"strings"

	"github.com/joho/godotenv"
	"github.com/sirupsen/logrus"
)

var (
	EnvDevelopment = "development"
)

type Env struct {
	Port             int    `env:"PORT"`
	Environment      string `env:"GO_ENV"`
	Version          string
	LogLevel         logrus.Level `env:"LOG_LEVEL"`
	Timeout          int16        `env:"TIMEOUT"`
	JWTSignKey       string       `env:"JWT_SIGN_KEY"`
	ClientEndpoints  []string     `env:"CLIENT_ENDPOINTS"`
	EtcdEndpoints    []string     `env:"ETCD_ENDPOINTS"`
	EtcdRootPassword string       `env:"ETCD_ROOT_PASSWORD"`
	EtcdJwtTTLMin    int          `env:"ETCD_JWT_TTL_MIN"`
}

var requiredEnvVars = []string{
	"PORT",
	"GO_ENV",
	"TIMEOUT",
	"CLIENT_ENDPOINTS",
	"JWT_SIGN_KEY",
	"ETCD_ENDPOINTS",
	"ETCD_ROOT_PASSWORD",
	"ETCD_JWT_TTL_MIN",
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
	jwtTTL, err := strconv.Atoi(os.Getenv("ETCD_JWT_TTL_MIN"))
	if err != nil {
		return nil, err
	}
	timeout, err := strconv.ParseInt(os.Getenv("TIMEOUT"), 0, 16)
	if err != nil {
		return nil, err
	}

	return &Env{
		Port:             appPort,
		Environment:      os.Getenv("GO_ENV"),
		LogLevel:         logLevel,
		Timeout:          int16(timeout),
		ClientEndpoints:  strings.Split(os.Getenv("CLIENT_ENDPOINTS"), ","),
		JWTSignKey:       os.Getenv("JWT_SIGN_KEY"),
		EtcdEndpoints:    strings.Split(os.Getenv("ETCD_ENDPOINTS"), ","),
		EtcdRootPassword: os.Getenv("ETCD_ROOT_PASSWORD"),
		EtcdJwtTTLMin:    jwtTTL,
	}, err
}

func fileExists(filename string) bool {
	info, err := os.Stat(filename)
	if os.IsNotExist(err) {
		return false
	}
	return !info.IsDir()
}
