package middleware

import (
	"errors"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

type Claims struct {
	UserID uint   `json:"user_id"`
	Role   string `json:"role"`
	jwt.RegisteredClaims
}

func (c *Claims) Valid() error {

	now := time.Now().UTC()

	if c.ExpiresAt != nil && now.After(c.ExpiresAt.Time) {
		return errors.New("token has expired")
	}

	if c.NotBefore != nil && now.Before(c.NotBefore.Time) {
		return errors.New("token not valid yet")
	}

	// Validate UserID
	if c.UserID == 0 {
		return errors.New("invalid user ID")
	}

	// Validate Role
	role := strings.ToLower(c.Role)
	validRoles := map[string]bool{
		"user":  true,
		"admin": true,
	}
	if !validRoles[role] {
		return errors.New("invalid role")
	}

	// Validate token expiration with additional safety check
	if c.ExpiresAt != nil {
		// Add 5 minutes buffer for clock skew
		if time.Until(c.ExpiresAt.Time) < -5*time.Minute {
			return errors.New("token has expired")
		}

		// Prevent tokens with far future expiration
		maxExp := time.Now().Add(24 * 30 * time.Hour) // 30 days
		if c.ExpiresAt.Time.After(maxExp) {
			return errors.New("token expiration too far in future")
		}
	}

	// Validate issued at time
	if c.IssuedAt != nil {
		// Token cannot be used before it's issued
		if time.Until(c.IssuedAt.Time) > 5*time.Minute {
			return errors.New("token used before issued time")
		}

		// Token cannot be issued in the future
		if c.IssuedAt.Time.After(time.Now().Add(5 * time.Minute)) {
			return errors.New("token issued in future")
		}
	}

	return nil
}

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
			return
		}
		tokenString := strings.Replace(authHeader, "Bearer ", "", 1)
		claims := &Claims{}

		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			return []byte(os.Getenv("JWT_SECRET")), nil
		})

		if err != nil || !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}
		c.Set("userID", claims.UserID)
		c.Set("userRole", claims.Role)
		c.Next()
	}
}

func GenerateTokens(userID uint, role string) (string, string, error) {
	// Access token
	accessClaims := Claims{
		UserID: userID,
		Role:   role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(15 * time.Minute)),
		},
	}

	accessToken, err := jwt.NewWithClaims(jwt.SigningMethodHS256, accessClaims).SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		return "", "", err
	}

	// Refresh token
	refreshClaims := Claims{
		UserID: userID,
		Role:   role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(7 * 24 * time.Hour)),
		},
	}

	refreshToken, err := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshClaims).SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		return "", "", err
	}

	return accessToken, refreshToken, nil
}
