package middleware

import (
	"fmt"
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
)

type RateLimiter struct {
	requests map[string][]time.Time
	mu       sync.Mutex
	limit    int
	window   time.Duration
}

func NewRateLimiter(limit int, window time.Duration) *RateLimiter {
	return &RateLimiter{
		requests: make(map[string][]time.Time),
		limit:    limit,
		window:   window,
	}
}

func (rl *RateLimiter) Middleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, exists := c.Get("userID")
		if !exists {
			c.Next()
			return
		}

		key := fmt.Sprintf("%v", userID)
		rl.mu.Lock()
		defer rl.mu.Unlock()

		now := time.Now()
		windowStart := now.Add(-rl.window)

		// Clean old requests
		if requests, ok := rl.requests[key]; ok {
			var validRequests []time.Time
			for _, t := range requests {
				if t.After(windowStart) {
					validRequests = append(validRequests, t)
				}
			}
			rl.requests[key] = validRequests
		}

		// Check limit
		if len(rl.requests[key]) >= rl.limit {
			c.JSON(http.StatusTooManyRequests, gin.H{
				"status": "error",
				"error":  "Rate limit exceeded. Please try again later.",
			})
			c.Abort()
			return
		}

		// Add current request
		rl.requests[key] = append(rl.requests[key], now)
		c.Next()
	}
}
