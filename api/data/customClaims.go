package data

import (
	"github.com/dgrijalva/jwt-go"
)

type CustomClaims struct {
	Token    string   `json:"token"`
	Username string   `json:"username"`
	Roles    []string `json:"roles"`
	jwt.StandardClaims
}
