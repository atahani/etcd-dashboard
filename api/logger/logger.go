package logger

import (
	"os"
	"time"

	"github.com/atahani/etcd-dashboard/api/config"
	"github.com/sirupsen/logrus"
)

type LogMessage struct {
	Time    time.Time              `json:"time"`
	Level   string                 `json:"level"`
	Message string                 `json:"message"`
	Version string                 `json:"version"`
	Where   string                 `json:"where"`
	Data    map[string]interface{} `json:"data,omitempty"`
}

type contextKey string

func (c contextKey) String() string {
	return string(c)
}

var (
	ContextLogRequest = contextKey("request")
)

func New(conf *config.Env) *logrus.Logger {
	logger := logrus.New()
	logger.Out = os.Stdout
	logger.Formatter = new(logrus.TextFormatter)
	logger.Hooks = make(logrus.LevelHooks)
	logger.Level = conf.LogLevel
	if conf.Environment != config.EnvDevelopment {
		// add the location of log, we put it as where => fileName:line
		logger.ReportCaller = true
	}
	return logger
}
