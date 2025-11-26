package utils

import (
	"html"
	"strings"
)

// SanitizeInput removes dangerous characters and HTML
func SanitizeInput(input string) string {
	// Trim whitespace
	sanitized := strings.TrimSpace(input)

	// HTML escape to prevent XSS
	sanitized = html.EscapeString(sanitized)

	return sanitized
}

// ValidateNoSQLInjection checks for SQL injection patterns
func ValidateNoSQLInjection(input string) bool {
	dangerous := []string{"--", ";", "/*", "*/", "xp_", "sp_", "DROP", "INSERT", "DELETE", "UPDATE"}
	inputUpper := strings.ToUpper(input)
	for _, pattern := range dangerous {
		if strings.Contains(inputUpper, pattern) {
			return false
		}
	}
	return true
}
